from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status


def toggle_like(model, serializer, request, pk: int) -> Response:
    """
    View function to toggle a like on a given model instance.
    Args:
        model: The model class of the instance.
        serializer: The serializer class for the instance.
        request: The request object.
        pk: The primary key of the instance.
    Returns:
        A DRF response object.
    """
    instance = get_object_or_404(model, pk=pk)
    user = request.user
    if user in instance.likes.all():
        instance.likes.remove(user)
    else:
        instance.likes.add(user)
        # remove user from dislikes if they disliked the instance before
        instance.dislikes.remove(user)
    instance_serializer = serializer(instance, context={'request': request})
    return Response(instance_serializer.data, status=status.HTTP_200_OK)


def toggle_dislike(model, serializer, request, pk: int) -> Response:
    """
    View function to toggle a dislike on a given model instance.
    Args:
        model: The model class of the instance.
        serializer: The serializer class for the instance.
        request: The request object.
        pk: The primary key of the instance.
    Returns:
        A DRF response object.
    """
    instance = get_object_or_404(model, pk=pk)
    user = request.user
    if user in instance.dislikes.all():
        instance.dislikes.remove(user)
    else:
        instance.dislikes.add(user)
        # remove user from likes if they liked the instance before
        instance.likes.remove(user)
    instance_serializer = serializer(instance, context={'request': request})
    return Response(instance_serializer.data, status=status.HTTP_200_OK)
