from django.urls import path

from . import views

urlpatterns = [
    path('users/', views.UserListAPIView.as_view()),
    path('users/me/avatar/', views.MyAvatarAPIView.as_view()),
    path('users/me/posts/', views.MyPostListAPIView.as_view()),
    path('users/me/followers/', views.MyFollowerListAPIView.as_view()),
    path('users/me/subscribers/', views.MySubscriberListAPIView.as_view()),
    path('users/me/', views.MyProfileAPIView.as_view()),
    path('followers/<int:pk>/', views.FollowerAPIView.as_view()),
    path('users/<int:pk>/', views.UserProfileAPIView.as_view()),
    path('users/<int:pk>/posts/', views.UserPostListAPIView.as_view()),
    path('posts/', views.PostListAPIView.as_view()),
    path('posts/create/', views.PostAPIView.as_view()),
    path('posts/edit/<int:pk>/', views.PostEditAPIView.as_view()),
    path('posts/delete/<int:pk>/', views.PostDeleteAPIView.as_view()),
    path('posts/images/delete/<int:pk>/', views.PostImageAPIView.as_view()),
    path('posts/reviews/<int:pk>/', views.PostReviewListAPIView.as_view()),
    path('posts/<int:pk>/', views.PostDetailAPIView.as_view()),
    path('tags/<str:slug>/', views.TagPostListAPIView.as_view()),
    path('reviews/create/', views.ReviewCreateAPIView.as_view()),
    path('reviews/delete/<int:pk>/', views.ReviewDeleteAPIView.as_view()),
    path('like_review/<int:pk>/', views.like_review),
    path('dislike_review/<int:pk>/', views.dislike_review),
    path('like_post/<int:pk>/', views.like_post),
    path('dislike_post/<int:pk>/', views.dislike_post),
]

