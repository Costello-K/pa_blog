from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

from user_profile.models import Profile
from services.create_profile import create_profile

User = get_user_model()


# add the CustomUser model for the admin interface
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'phone', 'date_joined', 'is_active', 'is_staff', 'is_verified', 'is_superuser']
    list_display_links = ['username']
    list_editable = ['phone', 'is_active', 'is_verified']
    search_fields = ('username', 'phone', 'email', 'is_superuser')

    # fieldsets for the 'add' form for a new user
    add_fieldsets = (
        ('User', {'fields': ('username', 'email', 'phone', 'password1', 'password2')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_verified', 'is_superuser')})
    )

    # fieldsets for the 'add' form for a new user
    fieldsets = (
        ('User', {'fields': ('username', 'email', 'phone', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_verified', 'is_superuser')}),
    )

    def save_model(self, request, obj, form, change):
        """
        Creates a profile for user when the user is created from the admin interface
        """
        super().save_model(request, obj, form, change)

        if not obj.is_superuser:
            create_profile(obj)
