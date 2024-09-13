from django.http import Http404
from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Like
from .serializers import LikeSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class LikeList(APIView):
    serializer_class = LikeSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get(self, request):
        likes = Like.objects.all()
        serializer = LikeSerializer(
            likes, many=True, context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = LikeSerializer(
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
