from django.contrib import admin

from user_profile.models import Profile


# add the Profile model for the admin interface
@admin.register(Profile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nickname', 'name', 'surname', 'date_of_birth', 'avatar')
    list_display_links = ('user', )
    list_editable = ('nickname', 'name', 'surname', 'date_of_birth')
    search_fields = ('nickname', 'user', 'name', 'surname', 'date_of_birth')

    # fieldsets for the 'add' form for a new profile
    add_fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Personal info', {'fields': ('nickname', 'name', 'surname', 'date_of_birth', 'avatar', 'followers')}),
    )

    # fieldsets for the 'change' form for an existing profile
    fieldsets = (
        ('User', {'fields': ('user', )}),
        ('Personal info', {'fields': ('nickname', 'name', 'surname', 'date_of_birth', 'avatar', 'followers')}),
    )
