from django.contrib import admin
from user_profile.models import Profile


@admin.register(Profile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'surname', 'date_of_birth', 'photo']
    list_display_links = ['user']
    list_editable = ['name', 'surname', 'date_of_birth']
    search_fields = ('user', 'name', 'surname', 'date_of_birth')

    add_fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Personal info', {'fields': ('name', 'surname', 'date_of_birth', 'photo')}),
    )

    fieldsets = (
        ('User', {'fields': ('user', )}),
        ('Personal info', {'fields': ('name', 'surname', 'date_of_birth', 'photo')}),
    )
