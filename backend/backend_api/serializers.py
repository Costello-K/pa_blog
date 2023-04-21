from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Q

from .models import Post, Review, Tag, Image, Ip
from user_profile.models import Profile
from services.serializers_helpers import (
    get_author_data,
    get_avatar_data,
    get_liked_data,
    get_disliked_data
)

User = get_user_model()


class UserProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a user Profile"""
    class Meta:
        model = Profile
        fields = ('name', 'surname', 'nickname', 'date_of_birth', 'avatar', )


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user"""
    profile = UserProfileCreateSerializer(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'phone', 'profile', )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Method for creating a new User"""
        profile = validated_data.pop('profile', {})
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)

        # if no nickname is given, assign your own unique nickname
        if not profile.get('nickname'):
            count = User.objects.count()
            new_user_nickname = f'user_{count}'

            # if the nickname is reserved, assign a new nickname
            while Profile.objects.filter(nickname=new_user_nickname).exists():
                count += 1
                new_user_nickname = f'user_{count}'
            profile['nickname'] = new_user_nickname

        Profile.objects.create(user=user, **profile)

        return user


class IpSerializer(serializers.ModelSerializer):
    """Serializer for IP model"""
    class Meta:
        model = Ip
        exclude = ('id', )


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    class Meta:
        model = Tag
        exclude = ('id', )


class TagCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new Tag"""
    class Meta:
        model = Tag
        fields = ('name', )


class PostImageSerializer(serializers.ModelSerializer):
    """Serializer for post Images"""
    class Meta:
        model = Image
        fields = ('id', 'image', )


class UserProfileListSerializer(serializers.ModelSerializer):
    """Serializer to get a list of users"""
    avatar = serializers.SerializerMethodField()
    name = serializers.CharField(source='profile.name', read_only=True)
    surname = serializers.CharField(source='profile.surname', read_only=True)
    nickname = serializers.CharField(source='profile.nickname', read_only=True)
    date_of_birth = serializers.DateField(source='profile.date_of_birth', read_only=True)
    followers = serializers.IntegerField(source='profile.followers.count', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'avatar', 'name', 'surname', 'nickname', 'date_of_birth', 'followers')

    def get_avatar(self, user):
        return get_avatar_data(user)


class UserProfileSerializer(UserProfileListSerializer):
    """Serializer to get a user profile"""
    subscribers = serializers.SerializerMethodField()
    subscribe = serializers.SerializerMethodField()

    class Meta(UserProfileListSerializer.Meta):
        fields = ('id', 'avatar', 'name', 'surname', 'nickname', 'date_of_birth', 'followers', 'subscribers',
                  'subscribe', )

    def get_subscribers(self, user):
        return Profile.objects.filter(followers=user).count()

    def get_subscribe(self, user):
        if self.context:
            request = self.context.get('request')
            if request.user and request.user.is_authenticated:
                return user.profile.followers.filter(pk=request.user.id).exists()
        return False


class MyProfileSerializer(UserProfileSerializer):
    """Serializer for getting and editing the profile of an authorized user"""
    avatar = serializers.ImageField(source='profile.avatar')
    name = serializers.CharField(source='profile.name')
    surname = serializers.CharField(source='profile.surname')
    nickname = serializers.CharField(source='profile.nickname')
    date_of_birth = serializers.DateField(source='profile.date_of_birth', allow_null=True)

    class Meta(UserProfileSerializer.Meta):
        fields = ('id', 'email', 'phone', 'avatar', 'name', 'surname', 'nickname', 'date_of_birth', 'followers',
                  'subscribers', )

    def validate_nickname(self, value):
        """Nickname uniqueness check"""
        user = self.get_user()
        if Profile.objects.filter(nickname=value).exclude(user=user).exists():
            raise serializers.ValidationError('Nickname already exists.')
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = get_avatar_data(instance)
        return data

    def get_user(self):
        """Method to get authorized user"""
        if not self.context:
            raise serializers.ValidationError('Request context is missing')

        request = self.context['request']

        if request.user and request.user.is_authenticated:
            return request.user

        raise serializers.ValidationError('User is not authenticated')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        for attr, value in profile_data.items():
            setattr(instance.profile, attr, value)
        instance.profile.save()
        return super().update(instance, validated_data)


class Meta(UserProfileSerializer.Meta):
    fields = ('id', 'email', 'phone', 'avatar', 'name', 'surname', 'nickname', 'date_of_birth', 'followers',
              'subscribers',)


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for post comments"""
    author = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {
            'author': {'required': False},
        }

    def create(self, validated_data):
        """Method for creating a new Review"""
        # validated_data must accept a context with an authorized user
        if not self.context:
            raise serializers.ValidationError('Request context is missing')

        request = self.context.get('request')
        if request.user and request.user.is_authenticated:
            validated_data['author'] = request.user
            review = Review.objects.create(**validated_data)
            return review
        raise serializers.ValidationError('User is not authenticated')


class FilterReviewListSerializer(serializers.ListSerializer):
    """Custom list serializer to filter out child reviews and return only the root reviews"""
    def to_representation(self, data):
        queryset = data.filter(parent=None)
        return super().to_representation(queryset)


class RecursiveSerializer(serializers.Serializer):
    """Serializer to handle recursive relationships in review replies"""
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class PostReviewListSerializer(serializers.ModelSerializer):
    """Serializer to get a list of post reviews"""
    author = serializers.SerializerMethodField()
    children = RecursiveSerializer(many=True)
    likes = serializers.IntegerField(source='likes.count', read_only=True)
    dislikes = serializers.IntegerField(source='dislikes.count', read_only=True)
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()

    class Meta:
        list_serializer_class = FilterReviewListSerializer
        model = Review
        fields = ('id', 'post', 'author', 'text', 'likes', 'dislikes', 'created_at', 'children', 'liked', 'disliked', )

    def get_author(self, review):
        return get_author_data(review)

    def get_liked(self, review):
        return get_liked_data(self, review)

    def get_disliked(self, review):
        return get_disliked_data(self, review)


class PostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating posts"""
    tags = TagCreateSerializer(many=True, required=False)
    images = PostImageSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ('id', 'author', 'status', 'title', 'text', 'tags', 'images', )
        # to be able to assign an author from a 'request',
        # you must set the value of the 'required' property for the 'author' field to 'False'
        extra_kwargs = {
            'author': {'required': False},
        }

    @staticmethod
    def validate_images(images_data, instance=None, method=''):
        """Method to check uploaded images by maximum file size and maximum number of files per post"""
        limitImage = settings.POST_MAX_NUMBER_IMAGES

        # assign a limit on the number of new images for a given post, depending on whether the post is new or existing
        if method == 'update':
            number_existing_photos = Image.objects.filter(post=instance).count()
            limitImage = settings.POST_MAX_NUMBER_IMAGES - number_existing_photos

        if len(images_data) > limitImage:
            raise ValidationError("Maximum 8 images allowed")

        # check the maximum file size
        for image_data in images_data:
            image = image_data.get('image')
            if image.size > (settings.POST_MAX_SIZE_IMAGES_MB * 1024 * 1024):
                raise ValidationError("Maximum image size allowed is 5MB")
        return images_data

    def create(self, validated_data):
        """Method for creating a new Post"""
        # validated_data must accept a context with an authorized user
        if not self.context:
            raise serializers.ValidationError('Request context is missing')

        request = self.context.get('request')
        if not request.user and not request.user.is_authenticated:
            raise serializers.ValidationError('User is not authenticated')

        # for update method we must set the value of the 'required' property for the 'author' field to 'True'
        validated_data['author'] = request.user

        # image list create
        images_data = validated_data.pop('images', [])
        images_data = self.validate_images(images_data)

        # tag list create
        tags_data = validated_data.pop('tags', [])
        tags = [Tag.objects.get_or_create(name=tag_data['name'])[0] for tag_data in tags_data]

        post = Post.objects.create(**validated_data)

        # save tags list
        post.tags.set(tags)

        # save image list
        images = [Image(post=post, image=image_data['image']) for image_data in images_data]
        Image.objects.bulk_create(images)

        return post

    def update(self, instance, validated_data):
        """Method to update Post"""
        self.fields['author'].required = True

        instance.title = validated_data.get('title', instance.title)
        instance.text = validated_data.get('text', instance.text)
        instance.status = validated_data.get('status', instance.status)

        # delete the existing list of tags in case of editing the tags field
        # added check for editing one field of the post, so that the tag field is not deleted
        if validated_data.get('tags') or len(validated_data) > 1:
            instance.tags.clear()

        # tag list update
        tags_data = validated_data.pop('tags', [])
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)

        # image list update
        images_data = validated_data.pop('images', [])
        images_data = self.validate_images(images_data, instance, 'update')
        images = [Image(post=instance, image=image_data['image']) for image_data in images_data]
        Image.objects.bulk_create(images)

        instance.save()
        return instance


class BasePostSerializer(serializers.ModelSerializer):
    """Basic serializer to work with post"""
    author = serializers.SerializerMethodField()
    likes = serializers.IntegerField(source='likes.count', read_only=True)
    dislikes = serializers.IntegerField(source='dislikes.count', read_only=True)
    views = serializers.IntegerField(source='views.count', read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'author', 'title', 'published_at', 'views', 'likes', 'dislikes', 'slug', )

    def get_author(self, post):
        return get_author_data(post)


class PostDetailSerializer(BasePostSerializer):
    """Serializer to get post data"""
    tags = TagSerializer(many=True, read_only=True)
    images = PostImageSerializer(many=True, read_only=True, required=False)
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()

    class Meta(BasePostSerializer.Meta):
        fields = ('id', 'author', 'status', 'images', 'tags', 'title', 'text', 'published_at', 'views', 'likes',
                  'dislikes', 'slug', 'liked', 'disliked', )

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Convert images to list of image URLs
        images = []
        for image in representation['images']:
            images.append(image)
        representation['images'] = images

        return representation

    def get_liked(self, post):
        return get_liked_data(self, post)

    def get_disliked(self, post):
        return get_disliked_data(self, post)


class PostListSerializer(BasePostSerializer):
    """Serializer to get a list of posts"""
    images = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta(BasePostSerializer.Meta):
        fields = ('id', 'author', 'images', 'tags', 'title', 'published_at', 'views', 'likes', 'dislikes', 'slug', )

    def get_tags(self, post):
        tags = post.tags.values('name', 'slug')
        return tags

    def get_images(self, post):
        if post.images.exists():
            return PostImageSerializer(post.images.first()).data
        # if the image does not exist, we send the image for the post by default without id
        return {'id': None, 'image': settings.POST_IMAGE_DEFAULT_URL}


class MyPostListSerializer(PostListSerializer):
    """Serializer to get a list of posts of an authorized user"""
    class Meta(PostListSerializer.Meta):
        fields = ('id', 'status', 'images', 'tags', 'title', 'created_at', 'published_at', 'updated_at', 'views',
                  'likes', 'dislikes', 'slug', )
