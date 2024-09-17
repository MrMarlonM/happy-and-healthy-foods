from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
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
    restaurant = serializers.ReadOnlyField(source='restaurant.name')
