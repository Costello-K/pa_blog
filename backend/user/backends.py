from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthBackend(object):
    """
    Custom authentication backend that allows users to log in using their email, username,
    or phone number as the username field.
    """
    supports_object_permissions = True
    supports_anonymous_user = False
    supports_inactive_user = False

    def get_user(self, user_id):
        """Retrieve the user's instance from the database with a given id"""
        try:
           return User.objects.get(pk=user_id)
        except User.DoesNotExist:
           return None

    def authenticate(self, request, username=None, password=None):
        """Authenticate a user with the given username or email or phone number and password."""
        try:
            user = User.objects.get(
                Q(username=username) |
                Q(email=username) |
                Q(phone=username)
            )
        except User.DoesNotExist:
            return None

        return user if user.check_password(password) else None
