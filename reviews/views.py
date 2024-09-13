from django.http import Http404
from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class ReviewList(APIView):
    serializer_class = ReviewSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(
            reviews, many=True, context={'request': request}
            )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ReviewSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(created_by=request.user.profile)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )
