from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Restaurant
from .serializers import RestaurantSerializer


class RestaurantList(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating restaurants.

    GET: Retrieve a list of restaurants.
         Supports filtering, searching, and ordering.

        Filtering:
        - `cuisine_type`: Filter by cuisine type (e.g., 'italian', 'japanese').
        - `dish__dietary_preference`: Filter by dietary preference of
                                      dishes served at the restaurant.
        - `created_by__username`: Filter by the username of the user who
                                  created the restaurant.

        Searching:
        - `search`: Search for restaurants by name, city, country,
                    cuisine type, dish name, or dish dietary preference.

        Ordering:
        - `ordering`: Order the results by one or more of the following fields:
                      'name', 'city', 'country', 'cuisine_type', 'like_count',
                      'review_count', 'created_at', 'updated_at'.
                      Prefix with '-' for descending order.

    POST: Create a new restaurant.
          Requires authentication, and the 'created_by' field is automatically
          set to the current user.
    """
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
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'cuisine_type',
        'dish__dietary_preference',
        'created_by__username',
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
    """
    API endpoint for retrieving, updating, and deleting a specific restaurant.

    GET: Retrieve the details of a single restaurant, including the like count
         and review count.

    PUT/PATCH: Update the details of an existing restaurant.
               Requires authentication and ownership of the restaurant.

    DELETE: Delete a restaurant.
            Requires authentication and ownership of the restaurant.
    """
    serializer_class = RestaurantSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Restaurant.objects.annotate(
        like_count=Count('like', distinct=True),
        review_count=Count('review', distinct=True)
    ).order_by('-created_at')
