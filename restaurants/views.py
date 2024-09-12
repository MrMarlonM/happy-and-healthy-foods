from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant
from .serializers import RestaurantSerializer


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

