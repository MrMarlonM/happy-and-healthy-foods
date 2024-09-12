from django.db import models
from django.contrib.auth.models import User


class Restaurant(models.Model):
    
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
    image = models.ImageField(upload_to='images/')
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
