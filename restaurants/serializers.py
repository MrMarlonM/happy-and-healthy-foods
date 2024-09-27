from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    """
    Serializer for the Restaurant model. Handles serialization and validation
    of restaurant data.

    Fields:
    - `created_by`: Read-only field representing the username of the user who
                    created the restaurant.
    - `is_owner`: Serializer method field indicating whether the current user
                  is the owner of the restaurant.

    Validation:
    - `image`: Ensures the uploaded image is not larger than 2MB and its
               dimensions do not exceed 4096px in width or height.

    Methods:
    - `get_is_owner`: Determines if the requesting user is the owner of
                      the restaurant.
    """
    created_by = serializers.ReadOnlyField(source='created_by.username')
    is_owner = serializers.SerializerMethodField()

    def validate_image(self, value):
        if value.size > 1024 * 1024 * 2:
            raise serializers.ValidationError(
                'Image size larger than 2MB.'
            )
        if value.image.width > 4096:
            raise serializers.ValidationError(
                'Image width larger than 4096px.'
            )
        if value.image.height > 4096:
            raise serializers.ValidationError(
                'Image height larger than 4096px.'
            )
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.created_by

    class Meta:
        model = Restaurant
        fields = '__all__'
