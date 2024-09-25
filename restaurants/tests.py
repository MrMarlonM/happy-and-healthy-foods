from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from .models import Restaurant
from PIL import Image
from io import BytesIO


class RestaurantListTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.restaurant1 = Restaurant.objects.create(
            created_by=self.user,
            name='Italian Restaurant',
            city='Rome',
            country='Italy',
            image='uploaded_image',
            short_description='example',
            cuisine_type='italian',
        )
        self.restaurant2 = Restaurant.objects.create(
            created_by=self.user,
            name='Japanese Restaurant',
            city='Tokyo',
            country='Japan',
            image='uploaded_image',
            short_description='example',
            cuisine_type='japanese',
        )

        self.client = APIClient()

        self.url = '/restaurants/'

    def test_list_restaurants(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_restaurant(self):
        self.client.force_authenticate(user=self.user)
        image = Image.new('RGB', (100, 100))
        image_io = BytesIO()
        image.save(image_io, format='JPEG')
        image_io.seek(0)
        uploaded_image = SimpleUploadedFile(
            'test_image.jpg',
            image_io.read(),
            content_type='image/jpeg'
            )

        data = {
            'name': 'New Restaurant',
            'city': 'Berlin',
            'country': 'Germany',
            'image': uploaded_image,
            'short_description': 'A great new place!',
            'cuisine_type': 'german',
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Restaurant.objects.count(), 3)


class RestaurantDetailTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.restaurant1 = Restaurant.objects.create(
            created_by=self.user,
            name='Italian Restaurant',
            city='Rome',
            country='Italy',
            image='uploaded_image',
            short_description='example',
            cuisine_type='italian',
        )
        self.restaurant2 = Restaurant.objects.create(
            created_by=self.user,
            name='Japanese Restaurant',
            city='Tokyo',
            country='Japan',
            image='uploaded_image',
            short_description='example',
            cuisine_type='japanese',
        )

        self.client = APIClient()

        self.url = f'/restaurants/{self.restaurant1.id}/'

    def test_retrieve_restaurant(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Italian Restaurant')

    def test_update_restaurant(self):
        self.client.force_authenticate(user=self.user)
        image = Image.new('RGB', (100, 100))
        image_io = BytesIO()
        image.save(image_io, format='JPEG')
        image_io.seek(0)
        uploaded_image = SimpleUploadedFile(
            'test_image.jpg',
            image_io.read(),
            content_type='image/jpeg'
            )
        data = {
            'name': 'Updated Restaurant',
            'city': 'Florence',
            'country': 'Germany',
            'image': uploaded_image,
            'short_description': 'A great new place!',
            'cuisine_type': 'german',
            }
        response = self.client.put(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.restaurant1.refresh_from_db()
        self.assertEqual(self.restaurant1.name, 'Updated Restaurant')
        self.assertEqual(self.restaurant1.city, 'Florence')

    def test_delete_restaurant(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Restaurant.objects.count(), 1)
