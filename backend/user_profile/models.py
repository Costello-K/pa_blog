from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from functools import partial

from services.get_file_path import FilePath

User = get_user_model()


class Profile(models.Model):
    """User profile model. We separate the logic associated with the user and the profile."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(_('name'), max_length=30, blank=True)
    surname = models.CharField(_('surname'), max_length=30, blank=True)
    nickname = models.CharField('nickname', max_length=100, unique=True)
    date_of_birth = models.DateField(_('date of birth'), blank=True, null=True)
    avatar = models.ImageField(
        _('avatar'),
        upload_to=partial(FilePath.get_path_with_unique_filename, file_path='images/profile/avatar'),
        blank=True,
    )
    followers = models.ManyToManyField(User, related_name='follow_user')

    def __str__(self):
        return f"{self.name} {self.surname} ({self.user})"
