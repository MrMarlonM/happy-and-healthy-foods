from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer, ReviewDetailSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class ReviewList(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Review.objects.all()