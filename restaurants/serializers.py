from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    owner = serializer.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Restaurant
        fields = '__all__'
