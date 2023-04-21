from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    """Custom user model manager where email is the unique identifier for authentication instead of username."""
    # Flag to indicate if this manager should be used during migrations
    use_in_migrations = True

    def _create_user(self, password=None, **extra_fields):
        """Create and save a User with the given email, phone and password."""
        # Checking if the user has entered an email address
        if not extra_fields.get('email'):
            raise ValueError('The given email must be set')

        # Set the username field to the normalized email value
        extra_fields['username'] = self.normalize_email(extra_fields['email'])
        # Create a new user object with the given fields
        user = self.model(**extra_fields)

        # Set the user's password and save the user to the database
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password=None, **extra_fields):
        """Creates a regular user with the given password and extra fields."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault('is_superuser', False)

        # Create a new user object and save it to the database
        return self._create_user(password=password, **extra_fields)

    def create_superuser(self, password, **extra_fields):
        """Creates a superuser with the given password and extra fields."""
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)

        # We check that the superuser has the is_staff and is_superuser parameters set to True.
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        # Create a new superuser object and save it to the database
        return self._create_user(password=password, **extra_fields)
