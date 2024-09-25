from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Review
from restaurants.models import Restaurant


class ReviewListTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword'
            )
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Italian Restaurant',
            city='Rome',
            country='Italy',
            image='uploaded_image',
            short_description='example',
            cuisine_type='italian',
            )
        self.review1 = Review.objects.create(
            restaurant=self.restaurant,
            created_by=self.user,
            content='Great food!',
        )
        self.review2 = Review.objects.create(
            restaurant=self.restaurant,
            created_by=self.user,
            content='Amazing service!',
        )

        self.client = APIClient()

        self.url = '/reviews/'

    def test_list_reviews(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_review_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'restaurant': self.restaurant.id,
            'content': 'Decent experience.',
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 3)

    def test_create_review_unauthenticated(self):
        data = {
            'restaurant': self.restaurant.id,
            'content': 'Decent experience.',
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ReviewDetailTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword'
            )
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Italian Restaurant',
            city='Rome',
            country='Italy',
            image='uploaded_image',
            short_description='example',
            cuisine_type='italian',
            )
        self.review1 = Review.objects.create(
            restaurant=self.restaurant,
            created_by=self.user,
            content='Great food!',
        )
        self.review2 = Review.objects.create(
            restaurant=self.restaurant,
            created_by=self.user,
            content='Amazing service!',
        )

        self.client = APIClient()

        self.url = f'/reviews/{self.review1.id}/'

    def test_retrieve_review(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Great food!')

    def test_update_review_owner(self):
        self.client.force_authenticate(user=self.user)
        data = {'content': 'Updated review.'}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review1.refresh_from_db()
        self.assertEqual(self.review1.content, 'Updated review.')

    def test_update_review_not_owner(self):
        other_user = User.objects.create_user(
            username='otheruser', password='otherpassword'
            )
        self.client.force_authenticate(user=other_user)
        data = {'content': 'Updated review.'}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_review_owner(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Review.objects.count(), 1)

    def test_delete_review_not_owner(self):
        other_user = User.objects.create_user(
            username='otheruser', password='otherpassword'
            )
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
