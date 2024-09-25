from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from restaurants.models import Restaurant


class Profile(models.Model):
    """
    Represents a user's profile, storing additional information and preferences.

    Relationships:
    - `owner`: The user associated with this profile (OneToOneField to User).
    - `favorites`: Restaurants that the user has favorited (ManyToManyField to Restaurant).
    """
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.ManyToManyField(
        Restaurant, related_name='favorited_by', blank=True
        )
    
    def __str__(self):
        return f"{self.owner}'s profile"


def create_profile(sender, instance, created, **kwargs):
    """
    Creates a Profile instance automatically when a new User is created.
    """
    if created:
        Profile.objects.create(owner=instance)


post_save.connect(create_profile, sender=User)
