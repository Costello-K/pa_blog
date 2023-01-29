from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username=None, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, phone and password.
        """
        if not username and not extra_fields.get('email') and not extra_fields.get('phone'):
            raise ValueError('The given email/phone must be set')

        user = None

        if not username:
            if extra_fields.get('phone'):
                username = extra_fields['phone']
            elif extra_fields.get('email'):
                extra_fields['email'] = self.normalize_email(extra_fields['email'])
                username = extra_fields['email']

        if username:
            user = self.model(username=username, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username=username, password=password, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)

        return self._create_user(username=username, password=password, **extra_fields)
