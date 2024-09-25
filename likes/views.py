from rest_framework import generics, permissions
from .models import Like
from .serializers import LikeSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class LikeList(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating likes (favorites) on restaurants.

    GET: Retrieve a list of all likes.

    POST: Create a new like for a restaurant. 
          Requires authentication, and the 'created_by' field is automatically set to the current user.
    """
    serializer_class = LikeSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LikeDetail(generics.RetrieveDestroyAPIView):
    """
    API endpoint for retrieving or deleting a specific like (favorite) on a restaurant.

    GET: Retrieve the details of a single like.

    DELETE: Delete an existing like. 
            Requires authentication and ownership of the like.
    """
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Like.objects.all()
