from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.created_by
    
    class Meta:
        model = Review
        fields = '__all__'
    

class ReviewDetailSerializer(ReviewSerializer):
    restaurant = serializers.ReadOnlyField(source='restaurant.name')
