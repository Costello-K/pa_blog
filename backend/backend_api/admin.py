from django.contrib import admin

from .models import Post, Image, Tag


# add the Post model for the admin interface
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'slug', 'created_at', 'published_at', 'status', )
    list_display_links = ('slug', )

    # fieldsets for the 'add' form for a new post
    add_fieldsets = (
        ('post', {'fields': ('title', )}),
        ('Info', {'fields': ('author', 'text', 'slug', 'tags', 'published_at', 'likes', 'dislikes', 'status')}),
    )

    # fieldsets for the 'change' form for an existing post
    fieldsets = (
        ('post', {'fields': ('title', )}),
        ('Info', {'fields': ('author', 'text', 'slug', 'tags', 'published_at', 'likes', 'dislikes', 'status')}),
    )


# add the Image model for the admin interface
@admin.register(Image)
class PostImageAdmin(admin.ModelAdmin):
    ...


# add the Tag model for the admin interface
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    ...
