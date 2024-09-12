from django.urls import path
from restaurants import views


urlpatterns = [
    path('restaurants/', views.RestaurantList.as_view()),
]
