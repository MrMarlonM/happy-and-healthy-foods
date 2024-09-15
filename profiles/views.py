from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly
from restaurants.models import Restaurant


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        restaurant_id = request.data.get('restaurant_id')

        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
                )
        
        if request.method == 'PUT':
            profile.favorites.add(restaurant)
        elif request.method == 'DELETE':
            profile.favorites.remove(restaurant)
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data)