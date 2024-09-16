from django.core.validators import MinValueValidator
from decimal import Decimal
from django.db import models
from restaurants.models import Restaurant


class Dish(models.Model):
    
    dietary_preferences_choices = [
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('pescatarian', 'Pescatarian'),
        ('gluten-free', 'Gluten-free'),
        ('halal', 'Halal'),
        ('kosher', 'Kosher'), 
        ('other', 'Other'),
    ]
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    short_description = models.TextField(max_length=500)
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    image = models.ImageField(upload_to='images/')
    dietary_preference = models.CharField(
        max_length=25, choices=dietary_preferences_choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name}"


class DietaryPreference(models.Model):
    name = models.CharField(max_length=25, unique=True)