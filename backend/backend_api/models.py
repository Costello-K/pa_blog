import string
import random
from django.db import models
from django.utils import timezone, text
from django.urls import reverse_lazy
from django.conf import settings
from django.contrib.auth import get_user_model
from functools import partial
from slugify import slugify

from user.models import CustomUser as User
from services.get_file_path import FilePath
from .constants import DRAFT, PUBLISHED

User = get_user_model()


class Tag(models.Model):
    """Model for a Tag object."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=105, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Override of the save method to auto-generate a unique slug for the Tag object."""
        if not self.slug:
            while True:
                new_slug_name = slugify(
                    f'{self.name}_{"".join(random.choices(string.ascii_lowercase + string.digits, k=4))}',
                    word_boundary=True,
                    save_order=True,
                    separator='_',
                )
                # check if the given slug exists in the database
                if not Tag.objects.filter(slug=new_slug_name).exists():
                    self.slug = new_slug_name
                    break
        super().save(*args, **kwargs)


class Ip(models.Model):
    """Model for an IP address object."""
    ip = models.GenericIPAddressField(unique=True)

    def __str__(self):
        return self.ip


class Post(models.Model):
    """Model for a Post object."""
    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
    )
    author = models.ForeignKey(User, related_name='post_author', on_delete=models.CASCADE, db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DRAFT)
    title = models.CharField(max_length=255)
    text = models.TextField()
    tags = models.ManyToManyField(Tag, related_name='post_tags', blank=True)
    slug = models.SlugField(max_length=270, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    dislikes = models.ManyToManyField(User, related_name='post_dislikes', blank=True)
    views = models.ManyToManyField(Ip, related_name='post_views', blank=True)

    class Meta:
        ordering = ('-created_at', )

    def save(self, *args, **kwargs):
        """Override of the save method to auto-generate a unique slug for the Post object."""
        if not self.slug:
            while True:
                new_slug_name = slugify(
                    f'{self.title}_{"".join(random.choices(string.ascii_lowercase + string.digits, k=8))}',
                    word_boundary=True,
                    save_order=True,
                    separator='_',
                )
                # check if the given slug exists in the database
                if not Post.objects.filter(slug=new_slug_name).exists():
                    self.slug = new_slug_name
                    break
        # add the publication date when the post is first published
        if self.status == PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.author}: {self.title}'


class Image(models.Model):
    """Model for a Image object."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=partial(FilePath.get_path_with_unique_filename, file_path='images/post'))

    def __str__(self):
        return f'{self.post.author}: {self.image.url}'


class Review(models.Model):
    """Model for a Review object."""
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='children',
    )
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='review_likes', blank=True, symmetrical=False)
    dislikes = models.ManyToManyField(User, related_name='review_dislikes', blank=True, symmetrical=False)

    class Meta:
        ordering = ('created_at', )

    def __str__(self):
        return f'{self.post}: {self.text[:50]}'
