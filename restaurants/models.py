from django.db import models
from django.contrib.auth.models import User


class Restaurant(models.Model):
    """
    Represents a restaurant, storing its name, location, cuisine type,
    a short description, image, and creation/update timestamps.

    Relationships:
    - `created_by`: The user who created this restaurant (ForeignKey to User).
    - `dishes`: Dishes served at this restaurant (reverse relationship from the Dish model).
    - `likes`: Users who have liked/favorited this restaurant (reverse relationship from the Like model).
    - `reviews`: Reviews associated with this restaurant (reverse relationship from the Review model).
    """
    cuisine_type_choices = [
        ('italian', 'Italian'),
        ('indian', 'Indian'),
        ('german', 'German'),
        ('japanese', 'Japanese'),
        ('chinese', 'Chinese'),
        ('thai', 'Thai'),
        ('mexican', 'Mexican'),
        ('greek', 'Greek'),
        ('french', 'French'),
        ('spanish', 'Spanish'),
        ('vietnamese', 'Vietnamese'),
        ('korean', 'Korean'),
        ('other', 'Other'),
    ]
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    image = models.ImageField(upload_to='images/', blank=True)
    short_description = models.TextField(max_length=500)
    cuisine_type = models.CharField(
        max_length=25, choices=cuisine_type_choices
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.id} {self.name}"
