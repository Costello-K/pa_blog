from django.contrib.auth import get_user_model

from user_profile.models import Profile

User = get_user_model()


def create_profile(instance: User):
    """Function to create a user profile"""
    if not isinstance(instance, User):
        raise TypeError("The 'instance' must be an instance of the User model")

    count = User.objects.count()
    new_user_nickname = f'user_{count}'

    # if the nickname is reserved, assign a new nickname
    while Profile.objects.filter(nickname=new_user_nickname).exists():
        count += 1
        new_user_nickname = f'user_{count}'

    Profile.objects.create(user=instance, nickname=new_user_nickname)
