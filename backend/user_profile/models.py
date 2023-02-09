from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from services.get_file_path import FilePath


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=30, blank=True)
    surname = models.CharField(_('surname'), max_length=30, blank=True)
    date_of_birth = models.DateField(_('date of birth'), blank=True, null=True)
    photo = models.ImageField(_('photo'), upload_to=FilePath('images/users/avatar').get_file_path, blank=True)

    def __str__(self):
        return f"{self.name} {self.surname} ({self.user})"

