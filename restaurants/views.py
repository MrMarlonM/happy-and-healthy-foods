from rest_framework import generics, permissions
from .models import Restaurant
from .serializers import RestaurantSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class RestaurantList(generics.ListCreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Restaurant.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class RestaurantDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Restaurant.objects.all()
