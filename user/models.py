import os
import uuid

from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class NewFileName:
    def __init__(self, filepath):
        self.filepath = filepath

    def get_file_name(self, obj, file_name):
        ext = file_name.strip().split('.')[-1]
        file_name = f'{uuid.uuid4()}.{ext}'
        return os.path.join(f'{self.filepath}', file_name)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_validator = RegexValidator(regex=r'^\+?3?8?[- 0]?[- (]?[- 0(]?[0-9]{2}\)?([ -]?[0-9]){7}',
                                     message='Enter phone in format +380XXXXXXXXX')
    email_validator = RegexValidator(regex=r'[\da-zA-Z](-?[_\da-zA-Z])*-?@([\da-zA-Z]+\.)*[a-z]{2,6}',
                                     message='Enter a valid email address')

    username = models.CharField(_('username'), max_length=255, unique=True)
    photo = models.ImageField(_('photo'), upload_to=NewFileName('images/users/avatar').get_file_name, blank=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    email = models.EmailField(_('email address'), validators=[email_validator], null=True, blank=True, unique=True)
    phone = models.CharField(_('phone number'), validators=[phone_validator], max_length=30, null=True, blank=True,
                             unique=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    last_login = models.DateTimeField(_('last login'), auto_now=True)
    is_active = models.BooleanField(_('active'), default=False)
    is_staff = models.BooleanField(_('staff'), default=False)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_superuser = models.BooleanField(_('superuser'), default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'phone']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        unique_together = ('username', 'email', 'phone')
