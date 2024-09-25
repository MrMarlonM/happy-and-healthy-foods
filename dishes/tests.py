from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from .models import Dish
from restaurants.models import Restaurant
from PIL import Image
from decimal import Decimal
from io import BytesIO


class DishListTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            )
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Test Restaurant',
            city='test',
            country='test',
            image='example',
            short_description='example',
            cuisine_type='italian',
            )
        
        self.dish1 = Dish.objects.create(
            restaurant=self.restaurant,
            name='Dish 1',
            short_description='example',
            price=10.99,
            image='example',
            dietary_preference='vegetarian',
        )
        self.dish2 = Dish.objects.create(
            restaurant=self.restaurant,
            name='Dish 2',
            short_description='example1',
            price=15.50,
            image='example',
            dietary_preference='vegan',
        )

        self.client = APIClient()

        self.url = f'/dishes/'

    def test_list_dishes(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_dish(self):
        self.client.force_authenticate(user=self.user) 
        
        image = Image.new('RGB', (100, 100))
        image_io = BytesIO()
        image.save(image_io, format='JPEG')
        image_io.seek(0)
        uploaded_image = SimpleUploadedFile(
            'test_image.jpg', image_io.read(), content_type='image/jpeg'
            )

        data = {
            'name': 'New Dish',
            'short_description': 'Delicious!',
            'price': '9.99',
            'restaurant': self.restaurant.id,
            'created_by': self.user.id, 
            'image': uploaded_image,
            'dietary_preference': 'vegetarian'
        }

        response = self.client.post(self.url, data, format='multipart') 

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Dish.objects.count(), 3)


class DishDetailTestCase(TestCase):
    def setUp(self):
        
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            )
        self.restaurant = Restaurant.objects.create(
            created_by=self.user,
            name='Test Restaurant',
            city='Example',
            country='example',
            image='uploaded_image',
            short_description='example',
            cuisine_type='italian',
            )
        self.restaurant.save()
        self.dish1 = Dish.objects.create(
            restaurant=self.restaurant,
            name='Dish 1',
            short_description='example',
            price=10.99,
            image='uploaded_image',
            dietary_preference='vegetarian',
        )
        self.dish1.save()
        self.dish2 = Dish.objects.create(
            restaurant=self.restaurant,
            name='Dish 2',
            short_description='example1',
            price=15.50,
            image='uploaded_image',
            dietary_preference='vegan',
        )

        self.client = APIClient()

        self.url = f'/dishes/{self.dish1.id}/'

    def test_retrieve_dish(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Dish 1')

    def test_update_dish(self):
        image = Image.new('RGB', (100, 100))
        image_io = BytesIO()
        image.save(image_io, format='JPEG')
        image_io.seek(0)
        uploaded_image = SimpleUploadedFile(
            'test_image.jpg', image_io.read(), content_type='image/jpeg'
            )
        self.client.force_authenticate(user=self.user)
        data = {
            'restaurant': self.restaurant.id,
            'name': 'Updated Dish',
            'short_description': 'example',
            'price': '13.50',
            'image': uploaded_image,
            'dietary_preference': 'vegetarian',
            }
        response = self.client.put(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.dish1.refresh_from_db()
        self.assertEqual(self.dish1.name, 'Updated Dish')
        self.assertEqual(self.dish1.price, 13.50)

    def test_delete_dish(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Dish.objects.count(), 1) 
