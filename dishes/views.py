from django.shortcuts import render
from rest_framework import permissions, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Dish
from .serializers import DishSerializer, DishDetailSerializer


class DishList(generics.ListCreateAPIView):
    serializer_class = DishSerializer
    queryset = Dish.objects.all()
    
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'dietary_preference',
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
    serializer_class = DishDetailSerializer
    queryset = Dish.objects.all()