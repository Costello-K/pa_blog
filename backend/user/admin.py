from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# admin.site.register(CustomUser)
# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'phone', 'date_joined', 'is_active', 'is_staff', 'is_verified', 'is_superuser']
    list_display_links = ['username']
    list_editable = ['phone', 'is_active', 'is_verified']
    search_fields = ('username', 'phone', 'email', 'is_superuser')

    add_fieldsets = (
        ('User', {'fields': ('username', 'email', 'phone', 'password1', 'password2')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_verified', 'is_superuser')})
    )

    fieldsets = (
        ('User', {'fields': ('username', 'email', 'phone', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_verified', 'is_superuser')}),
    )
