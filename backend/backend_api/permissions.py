from rest_framework import permissions


class IsAuthor(permissions.BasePermission):
    """Custom permission to only allow authors to edit and delete their own objects."""
    def has_object_permission(self, request, view, instance):
        return instance.author == request.user


class IsOwnerPostImage(permissions.BasePermission):
    """Custom permission to only allow owners to edit and delete their own post images."""
    def has_object_permission(self, request, view, instance):
        return instance.post.author == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit and delete their own objects, but allow any user to view them."""
    def has_object_permission(self, request, view, instance):
        if request.method in permissions.SAFE_METHODS:
            return True
        return instance.post.author == request.user


class ReadOnlyPermission(permissions.BasePermission):
    """
    Custom permission that allows only the administrator to create, delete, and edit objects.
    View only available to other users
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny()
        return permissions.IsAdminUser()
