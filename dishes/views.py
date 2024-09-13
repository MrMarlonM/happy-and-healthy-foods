from rest_framework import permissions, generics
from django.shortcuts import render
from .models import Dish
from .serializers import DishSerializer, DishDetailSerializer


class DishList(generics.ListCreateAPIView):
    serializer_class = DishSerializer
    queryset = Dish.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()


class DishDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DishDetailSerializer
    queryset = Dish.objects.all()