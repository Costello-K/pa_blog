from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# admin.site.register(CustomUser)
# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'first_name', 'last_name', 'phone', 'email']
    list_display_links = ['username']
    list_editable = ['first_name', 'last_name']
    search_fields = ('username', 'first_name', 'last_name', 'phone', 'email')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'password1', 'password2'),
        }),
        # (None, {'fields': ('username', 'password', 'password2', 'first_name', 'last_name', 'phone', 'email')}),
    )

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name',)}),
        ('Permissions', {'fields': ('is_admin',)}),
        # (None, {'fields': ('phone', )}),
    )
