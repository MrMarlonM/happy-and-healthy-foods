from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly
from restaurants.models import Restaurant


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        restaurant_id = request.data.get('restaurant_id')

        if not restaurant_id:
            return Response(
                {'error': 'Restaurant ID is required'},
                status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
                )
        
        profile.favorites.add(restaurant)
        return Response(
            {'message': 'Restaurant added to favorites'},
            status=status.HTTP_200_OK
            )

    def delete(self, request, *args, **kwargs):
        profile = self.get_object()
        restaurant_id = request.data.get('restaurant_id')

        if not restaurant_id:
            return Response(
                {'error': 'Restaurant ID is required'},
                status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        profile.favorites.remove(restaurant)
        return Response(status=status.HTTP_204_NO_CONTENT)
