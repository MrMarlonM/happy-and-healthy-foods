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


class LikeDetail(APIView):
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            like = Like.objects.get(pk=pk)
            self.check_object_permissions(self.request, like)
            return like
        except Like.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        like = self.get_object(pk)
        serializer = LikeSerializer(
            like, context={'request': request}
        )
        return Response(serializer.data)
    
    def delete(self, request, pk):
        like = self.get_object(pk)
        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
