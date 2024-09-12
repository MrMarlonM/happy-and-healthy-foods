from django.urls import path
from restaurants import views


urlpatterns = [
    path('restaurants/', views.RestaurantList.as_view()),
    path('restaurants/<int:pk>/', views.RestaurantDetail.as_view()),
]
