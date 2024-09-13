from django.http import Http404
from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant
from .serializers import RestaurantSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class RestaurantList(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(
            restaurants, many=True, context={'request': request}
            )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = RestaurantSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class RestaurantDetail(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            restaurant = Restaurant.objects.get(pk=pk)
            self.check_object_permissions(self.request, restaurant)
            return restaurant
        except Restaurant.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        restaurant = self.get_object(pk)
        serializer = RestaurantSerializer(
            restaurant, context={'request': request}
        )
        return Response(serializer.data)
    
    def put(self, request, pk):
        restaurant = self.get_object(pk)
        serializer = RestaurantSerializer(
            restaurant, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        restaurant = self.get_object(pk)
        restaurant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
