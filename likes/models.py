from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant


class Like(models.Model):
    """
    Represents a 'like' or 'favorite' action by a user on a restaurant.

    Relationships:
    - `restaurant`: The restaurant that received the like
                    (ForeignKey to Restaurant).
    - `created_by`: The user who liked the restaurant (ForeignKey to User).
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['restaurant', 'created_by']

    def __str__(self):
        return f"{self.restaurant} {self.created_by}"
