from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Review
from .serializers import ReviewSerializer, ReviewDetailSerializer


class ReviewList(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating reviews.

    GET: Retrieve a list of reviews. Supports filtering, searching, and
         ordering.

        Filtering:
        - `restaurant`: Filter by the restaurant the reviews
                        are associated with.

        Searching:
        - `search`: Search for reviews by the username of the creator or
                    the content of the review.

        Ordering:
        - `ordering`: Order the results by 'updated_at'.
                      Prefix with '-' for descending order.

    POST: Create a new review.
          Requires authentication, and the 'created_by' field is automatically
          set to the current user.
    """
    serializer_class = ReviewSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Review.objects.all()
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'restaurant',
    ]
    search_fields = [
        'created_by',
        'content',
    ]
    ordering_fields = [
        'updated_at',
    ]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific review.

    GET: Retrieve the details of a single review.

    PUT/PATCH: Update the details of an existing review.
               Requires authentication and ownership of the review.

    DELETE: Delete a review.
            Requires authentication and ownership of the review.
    """
    serializer_class = ReviewDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Review.objects.all()
