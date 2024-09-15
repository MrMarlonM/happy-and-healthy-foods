from django.db.models import Count
from rest_framework import generics, permissions, filters
from .models import Restaurant
from .serializers import RestaurantSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class RestaurantList(generics.ListCreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Restaurant.objects.annotate(
        like_count=Count('like', distinct=True),
        review_count=Count('review', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = [
        'name',
        'city',
        'country',
        'cuisine_type',
        'dish__name',
        'dish__dietary_preference',
    ]
    ordering_fields = [
        'name',
        'city',
        'country',
        'cuisine_type',
        'like_count',
        'review_count',
        'created_at',
        'updated_at',
    ]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class RestaurantDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Restaurant.objects.annotate(
        like_count=Count('like', distinct=True),
        review_count=Count('review', distinct=True)
    ).order_by('-created_at')
