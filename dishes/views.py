from rest_framework import permissions, generics, filters
from django.shortcuts import render
from .models import Dish
from .serializers import DishSerializer, DishDetailSerializer


class DishList(generics.ListCreateAPIView):
    serializer_class = DishSerializer
    queryset = Dish.objects.all()
    
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
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