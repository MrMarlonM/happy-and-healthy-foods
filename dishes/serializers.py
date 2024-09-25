from rest_framework import serializers
from .models import Dish


class DishSerializer(serializers.ModelSerializer):
    """
    Serializer for the Dish model. Handles serialization and validation
    of dish data.

    Validation:
    - `image`: Ensures the uploaded image is not larger than 2MB and its
               dimensions do not exceed 4096px in width or height.
    """
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

    class Meta:
        model = Dish
        fields = '__all__'


class DishDetailSerializer(DishSerializer):
    """
    Serializer for detailed dish information. Inherits from DishSerializer.

    Additional fields:
    - `restaurant`: Read-only field representing the ID of the associated
                    restaurant.
    """
    restaurant = serializers.ReadOnlyField(source="restaurant.id")
