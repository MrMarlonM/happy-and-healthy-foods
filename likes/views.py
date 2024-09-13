from rest_framework import generics, permissions
from .models import Like
from .serializers import LikeSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class LikeList(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LikeDetail(generics.RetrieveDestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Like.objects.all()