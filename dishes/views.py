from django.shortcuts import render
from rest_framework import permissions, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Dish
from .serializers import DishSerializer, DishDetailSerializer


class DishList(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating dishes.

    GET: Retrieve a list of dishes, optionally filtered by dietary preference
         or restaurant, searched by name or description, and ordered by
         specified fields.

    POST: Create a new dish. Requires authentication.
    """
    serializer_class = DishSerializer
    queryset = Dish.objects.all()

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'dietary_preference',
        'restaurant',
    ]
    search_fields = [
        'name',
        'short_description',
        'dietary_preference',
    ]
    ordering_fields = [
        'price',
        'dietary_preference',
        'created_at',
        'updated_at',
    ]

    def perform_create(self, serializer):
        serializer.save()


class DishDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific dish.

    GET: Retrieve the details of a single dish.

    PUT/PATCH: Update the details of an existing dish. Requires authentication
               and ownership.

    DELETE: Delete a dish. Requires authentication and ownership.
    """
    serializer_class = DishDetailSerializer
    queryset = Dish.objects.all()
