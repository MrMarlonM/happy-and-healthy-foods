from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile
from restaurants.models import Restaurant


class ProfileDetailTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword'
        )
        self.profile, created = Profile.objects.get_or_create(owner=self.user)

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
        self.client.force_authenticate(user=self.user)

        self.url = f'/profiles/{self.profile.id}/favorites/'

    def test_add_favorite(self):
        data = {'restaurant_id': self.restaurant.id}
        response = self.client.put(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['message'], 'Restaurant added to favorites'
        )
        self.assertIn(self.restaurant, self.profile.favorites.all())

    def test_remove_favorite(self):
        self.profile.favorites.add(self.restaurant)

        data = {'restaurant_id': self.restaurant.id}
        response = self.client.delete(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertNotIn(self.restaurant, self.profile.favorites.all())
