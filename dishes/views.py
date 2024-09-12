from django.http import Http404
from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Dish
from .serializers import DishSerializer


class DishList(APIView):
    serializer_class = DishSerializer

    def get(self, request):
        dishes = Dish.objects.all()
        serializer = DishSerializer(
            dishes, many=True, context={'request': request}
        )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = DishSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class DishDetail(APIView):
    serializer_class = DishSerializer

    def get_object(self, pk):
        try:
            dish = Dish.objects.get(pk=pk)
            self.check_object_permissions(self.request, dish)
            return dish
        except Dish.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        dish = self.get_object(pk)
        serializer = DishSerializer(
            dish, context={'request': request}
        )
        return Response(serializer.data)
