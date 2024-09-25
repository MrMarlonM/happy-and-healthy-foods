from django.db import IntegrityError
from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Like model. Handles serialization and
    validation of likes (favorites).

    Fields:
    - `created_by`: Read-only field representing the username
                    of the user who created the like.

    Methods:
    - `create`: Overrides the default create method to handle potential
                IntegrityErrors (e.g., duplicate likes) and raise a
                ValidationError if a duplicate is detected.
    """
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Like
        fields = '__all__'

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'possible duplicate'
            })
