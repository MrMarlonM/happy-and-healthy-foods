from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly
from restaurants.models import Restaurant


class ProfileList(generics.ListAPIView):
    """
    API endpoint for listing user profiles.

    GET: Retrieve a list of all user profiles.
    """
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific user profile.
    """ 
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()

    def update(self, request, *args, **kwargs):
        """
        Handles PUT requests to update a user's favorite restaurants.

        Expects 'restaurant_id' in the request data.

        Adds the specified restaurant to the user's favorites if it exists.

        Returns:
        - 200 OK with a success message if the restaurant is added successfully.
        - 400 Bad Request if 'restaurant_id' is missing.
        - 404 Not Found if the restaurant with the given ID doesn't exist.
        """
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
        """
        Handles DELETE requests to remove a restaurant from a user's favorites.

        Expects 'restaurant_id' in the request data.

        Removes the specified restaurant from the user's favorites if it exists.

        Returns:
        - 204 No Content if the restaurant is removed successfully.
        - 400 Bad Request if 'restaurant_id' is missing.
        - 404 Not Found if the restaurant with the given ID doesn't exist.
        """
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
