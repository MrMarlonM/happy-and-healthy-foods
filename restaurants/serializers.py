from rest_framework import serializers
from .models import Restaurant
from likes.models import Like


class RestaurantSerializer(serializers.ModelSerializer):
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
