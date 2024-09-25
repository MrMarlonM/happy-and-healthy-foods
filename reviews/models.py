from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant


class Review(models.Model):
    """
    Represents a review written by a user about a restaurant.

    Relationships:
    - `restaurant`: The restaurant being reviewed (ForeignKey to Restaurant).
    - `created_by`: The user who wrote the review (ForeignKey to User).
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.restaurant} {self.created_by}"
