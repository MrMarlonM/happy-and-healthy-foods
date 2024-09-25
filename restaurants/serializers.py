from rest_framework import serializers
from .models import Restaurant
from likes.models import Like


class RestaurantSerializer(serializers.ModelSerializer):
    """
    Serializer for the Restaurant model. Handles serialization and validation
    of restaurant data.

    Fields:
    - `created_by`: Read-only field representing the username of the user who
                    created the restaurant.
    - `is_owner`: Serializer method field indicating whether the current user
                  is the owner of the restaurant.
    - `like_id`: Serializer method field representing the ID of the like object
                 if the current user has liked the restaurant, otherwise None.
    - `like_count`: Read-only field representing the total number of likes for
                    the restaurant.
    - `review_count`: Read-only field representing the total number of reviews
                      for the restaurant.

    Validation:
    - `image`: Ensures the uploaded image is not larger than 2MB and its
               dimensions do not exceed 4096px in width or height.

    Methods:
    - `get_is_owner`: Determines if the requesting user is the owner of
                      the restaurant.
    - `get_like_id`: Retrieves the ID of the like object if the current user
                     has liked the restaurant.
    """
    created_by = serializers.ReadOnlyField(source='created_by.username')
    is_owner = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    like_count = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

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

    def get_like_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            like = Like.objects.filter(
                created_by=user, restaurant=obj
            ).first()
            return like.id if like else None
        return None

    class Meta:
        model = Restaurant
        fields = '__all__'
