import os
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.conf import settings
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes

from .models import Post, Review, Image, Ip, Tag
from user_profile.models import Profile
from .permissions import IsAuthor, IsOwnerPostImage
from services.pagination import SettingsPageNumberPagination, SettingsCommentPagination
from services.get_client_ip import get_client_ip
from services.views_helpers import toggle_like, toggle_dislike
from .constants import DRAFT, PUBLISHED
from .serializers import (
    UserCreateSerializer,
    MyProfileSerializer,
    UserProfileSerializer,
    UserProfileListSerializer,
    PostCreateSerializer,
    PostDetailSerializer,
    PostListSerializer,
    PostImageSerializer,
    MyPostListSerializer,
    ReviewSerializer,
    PostReviewListSerializer,
    IpSerializer,
)

User = get_user_model()


class UserProfileAPIView(generics.RetrieveAPIView):
    """Show user profile"""
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class MyProfileAPIView(generics.RetrieveUpdateAPIView):
    """Show and update authorized user profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MyProfileSerializer

    def get_object(self):
        return self.request.user

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class MyAvatarAPIView(MyProfileAPIView):
    """Update or remove an authorized user's avatar"""

    def delete(self, request):
        profile = self.get_object().profile

        # if the avatar is already the default avatar, do nothing
        if profile.avatar == settings.USER_AVATAR_DEFAULT_URL:
            return Response(status=status.HTTP_200_OK)

        # delete avatar (profile.avatar.delete() does not work correctly)
        profile.avatar = None
        profile.save()

        serialiser = self.serializer_class(profile.user)
        return Response(serialiser.data, status=status.HTTP_200_OK)

class UserListAPIView(generics.ListAPIView):
    """Show a list of all users"""
    serializer_class = UserProfileListSerializer
    search_fields = ['profile__name', 'profile__surname', 'profile__nickname']

    def get_queryset(self):
        return User.objects.all().exclude(pk=self.request.user.id)


class MyFollowerListAPIView(generics.ListAPIView):
    """Show list of followers"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileListSerializer
    search_fields = ['profile__name', 'profile__surname', 'profile__nickname']

    def get_queryset(self):
        return get_object_or_404(Profile, user=self.request.user).followers.all()


class MySubscriptionsListAPIView(MyFollowerListAPIView):
    """Show list of subscriptions"""
    def get_queryset(self):
        return User.objects.filter(profile__followers=self.request.user)


class PostDetailAPIView(generics.RetrieveAPIView):
    """Show single post"""
    serializer_class = PostDetailSerializer
    queryset = Post.objects.all()

    def get(self, request, *args, **kwargs):
        user_ip = get_client_ip(request)
        ip, _ = Ip.objects.get_or_create(ip=user_ip)

        post = self.get_object()
        if post.status == DRAFT and request.user.is_authenticated and post.author_id != request.user.id:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if ip not in post.views.all():
            post.views.add(ip)

        serializer = self.serializer_class(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostAPIView(generics.CreateAPIView):
    """Create new post"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class PostEditAPIView(generics.UpdateAPIView):
    """Update only specified post fields if authorized user is the owner"""
    permission_classes = [permissions.IsAuthenticated, IsAuthor]
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


class PostDeleteAPIView(generics.DestroyAPIView):
    """Remove post if authorized user is the owner"""
    permission_classes = [permissions.IsAuthenticated, IsAuthor]
    queryset = Post.objects.all()


class PostImageAPIView(generics.DestroyAPIView):
    """Delete image in post if authorized user is the owner"""
    queryset = Image.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerPostImage]

    def perform_destroy(self, instance):
        instance.delete()
        file_path = os.path.join(settings.MEDIA_ROOT, instance.image.name)
        os.remove(file_path)


class PostListAPIView(generics.ListAPIView):
    """Show list of all posts"""
    serializer_class = PostListSerializer
    queryset = Post.objects.filter(status=PUBLISHED)
    filterset_fields = ['title', 'tags__name']
    search_fields = ['title', 'tags__name']


class MyPostListAPIView(generics.ListAPIView):
    """Show a list of all posts of an authorized user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MyPostListSerializer
    filterset_fields = ['status']
    search_fields = ['title', 'tags__name']

    def get_queryset(self):
        return Post.objects.filter(author_id=self.request.user.id)


class UserPostListAPIView(generics.ListAPIView):
    """Show a list of all posts by the specified user"""
    serializer_class = PostListSerializer
    search_fields = ['title', 'tags__name']

    def get_queryset(self):
        return Post.objects.filter(author_id=self.kwargs.get('pk'), status=PUBLISHED)


class TagPostListAPIView(generics.ListAPIView):
    """Show a list of all posts by tag"""
    serializer_class = PostListSerializer
    search_fields = ['tags__name']

    def get_queryset(self):
        tag = get_object_or_404(Tag, slug=self.kwargs.get('slug'))
        return Post.objects.filter(tags__name__icontains=tag.name, status=PUBLISHED)


class ReviewCreateAPIView(generics.CreateAPIView):
    """Creating a review"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

class ReviewDeleteAPIView(generics.DestroyAPIView):
    """Delete authorized user's comment"""
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAuthor]


class PostReviewListAPIView(generics.ListAPIView):
    """Show the list of comments of the specified post"""
    serializer_class = PostReviewListSerializer
    pagination_class = SettingsCommentPagination

    def get_queryset(self):
        return Review.objects.filter(post_id=self.kwargs.get('pk'))

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True, context={'request': request})
        paginated_reviews = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(paginated_reviews)


class FollowerAPIView(generics.UpdateAPIView):
    """Class for subscribing and unsubscribing from a user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        auth_user = request.user

        if user == auth_user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if user.profile.followers.filter(pk=auth_user.id).exists():
            user.profile.followers.remove(auth_user)
        else:
            user.profile.followers.add(auth_user)

        serializer = self.serializer_class(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, pk):
    """Function to like the specified post by an authorized user"""
    return toggle_like(Post, PostDetailSerializer, request, pk)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def dislike_post(request, pk):
    """Function to dislike the specified post by an authorized user"""
    return toggle_dislike(Post, PostDetailSerializer, request, pk)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_review(request, pk):
    """Function to like the specified review by an authorized user"""
    return toggle_like(Review, PostReviewListSerializer, request, pk)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def dislike_review(request, pk):
    """Function to dislike the specified review by an authorized user"""
    return toggle_dislike(Review, PostReviewListSerializer, request, pk)
