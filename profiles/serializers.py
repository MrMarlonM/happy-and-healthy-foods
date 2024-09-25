from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model. Handles serialization and
    validation of user profiles.

    Fields:
    - `owner`: Read-only field representing the username of the profile owner.
    - `is_owner`: Serializer method field indicating whether the current user
                  is the owner of the profile.

    Methods:
    - `get_is_owner`: Determines if the requesting user is the owner
                      of the profile.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Profile
        fields = '__all__'
