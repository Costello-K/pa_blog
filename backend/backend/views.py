from rest_framework_simplejwt.views import TokenViewBase, TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import status, views
from rest_framework.response import Response
from django.conf import settings
from datetime import timedelta
from django.contrib.sessions import middleware


class CustomTokenViewBase(TokenViewBase):
    def post(self, request, refresh_token, *args, **kwargs):
        data = {'refresh': refresh_token}
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(CustomTokenViewBase, TokenObtainPairView):
    pass


class CustomTokenRefreshView(CustomTokenViewBase, TokenRefreshView):
    pass


class CustomTokenObtainPairView(CustomTokenObtainPairView):
    """Class for getting access token and also refresh token through cookies"""
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        # get access token and refresh token
        access_token = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']

        # set access token in Response
        response = Response({'access': access_token}, status=status.HTTP_200_OK)
        # set refresh token in browser cookie
        response.set_cookie(
            settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token'),
            refresh_token,
            max_age=settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', timedelta(days=1)).total_seconds(),
            domain=settings.SIMPLE_JWT.get('AUTH_COOKIE_DOMAIN', None),
            path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'),
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            httponly=settings.SIMPLE_JWT.get('AUTH_COOKIE_HTTP_ONLY', True),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        )

        return response


class CustomTokenRefreshView(CustomTokenRefreshView):
    """Class for updating an access token using a refresh token obtained from cookies"""
    def post(self, request, *args, **kwargs):
        try:
            # get refresh token from cookies
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token is None:
                raise InvalidToken('No refresh token found in cookies')

        except InvalidToken:
            pass

        return super().post(request, refresh_token=refresh_token, *args, **kwargs)


class Cookies(views.APIView):
    """Class for working with cookies"""
    def delete(self, request):
        """Method to remove refresh token from cookies"""
        response = Response(request.data, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')

        return response
