from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator

from .managers import CustomUserManager as UserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """User model"""
    # Regular expression for validating phone number in Ukraine
    phone_validator = RegexValidator(regex=r'^\+?3?8?[- 0]?[- (]?[- 0(]?[0-9]{2}\)?([ -]?[0-9]){7}',
                                     message='Enter phone in format +380XXXXXXXXX')

    # username is equal to the value of the email field
    username = models.CharField(_('username'), max_length=255, unique=True)
    email = models.EmailField(_('email'), validators=[EmailValidator(message='Invalid Email')], unique=True)
    phone = models.CharField(_('phone number'), validators=[phone_validator],
                             max_length=25, blank=True, null=True, unique=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    last_login = models.DateTimeField(_('last login'), blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=False)
    is_staff = models.BooleanField(_('staff'), default=False)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_superuser = models.BooleanField(_('superuser'), default=False)

    # user manager used to work with objects of this model
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ('email', )

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
