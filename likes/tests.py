from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Like
from restaurants.models import Restaurant


class LikeListTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Test Restaurant',
            city='test',
            country='test',
            image='example',
            short_description='example',
            cuisine_type='italian',
            )

        self.client = APIClient()

        self.url = '/likes/'

    def test_create_like_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {'restaurant': self.restaurant.id}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 1)

    def test_create_like_unauthenticated(self):
        data = {'restaurant': self.restaurant.id}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) 

    def test_list_likes(self):
        Like.objects.create(restaurant=self.restaurant, created_by=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class LikeDetailTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Test Restaurant',
            city='test',
            country='test',
            image='example',
            short_description='example',
            cuisine_type='italian',
            )

        self.client = APIClient()

        self.like = Like.objects.create(restaurant=self.restaurant, created_by=self.user)
        self.url = f'/likes/{self.like.id}/'

    def test_retrieve_like(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_like_owner(self):
        self.client.force_authenticate(user=self.user) 
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Like.objects.count(), 0)

    def test_delete_like_not_owner(self):
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        self.client.force_authenticate(user=other_user) 
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)