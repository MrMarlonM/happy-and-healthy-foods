from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Like
        fields = '__all__'
