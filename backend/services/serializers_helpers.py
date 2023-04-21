from django.conf import settings
from rest_framework import serializers


def get_author_data(instance):
    """Returns author's data for a given instance"""
    user = instance.author
    profile = user.profile
    author = {
        'id': user.pk,
        'nickname': profile.nickname,
        'name': profile.name,
        'surname': profile.surname,
    }

    return author


def get_avatar_data(instance):
    """Returns avatar url for a given instance, if there is no avatar, it will return the default avatar"""
    avatar_url = None
    if instance.profile.avatar and instance.profile.avatar.file:
        avatar_url = instance.profile.avatar.url

    return avatar_url or settings.USER_AVATAR_DEFAULT_URL


def get_liked_data(self, instance):
    """Returns True if authenticated user has liked the instance, else False"""
    if not self.context:
        raise serializers.ValidationError('Request context is missing')

    request = self.context.get('request')
    if request.user and request.user.is_authenticated:
        return instance.likes.filter(pk=request.user.id).exists()

    return False


def get_disliked_data(self, instance):
    """Returns True if authenticated user has disliked the instance, else False"""
    if not self.context:
        raise serializers.ValidationError('Request context is missing')

    request = self.context.get('request')
    if request.user and request.user.is_authenticated:
        return instance.dislikes.filter(pk=request.user.id).exists()

    return False
