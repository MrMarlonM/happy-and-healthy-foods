from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for the Review model. Handles serialization and validation of reviews.

    Fields:
    - `created_by`: Read-only field representing the username of the user who created the review.
    - `is_owner`: Serializer method field indicating whether the current user is the owner of the review.
    - `created_at`: Serializer method field providing a human-readable representation of the creation timestamp.
    - `updated_at`: Serializer method field providing a human-readable representation of the last update timestamp.

    Methods:
    - `get_is_owner`: Determines if the requesting user is the owner of the review.
    - `get_created_at`: Converts the `created_at` timestamp to a human-readable format using `naturaltime`.
    - `get_updated_at`: Converts the `updated_at` timestamp to a human-readable format using `naturaltime`.
    """
    created_by = serializers.ReadOnlyField(source='created_by.username')
    is_owner = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.created_by
    
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)

    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)

    class Meta:
        model = Review
        fields = '__all__'
    

class ReviewDetailSerializer(ReviewSerializer):
    """
    Serializer for detailed review information. Inherits from ReviewSerializer.

    Additional fields:
    - `restaurant`: Read-only field representing the name of the associated restaurant.
    """
    restaurant = serializers.ReadOnlyField(source='restaurant.name')
