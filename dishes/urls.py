from django.urls import path
from dishes import views


urlpatterns = [
    path('dishes/', views.DishList.as_view()),
    path('dishes/<int:pk>/', views.DishDetail.as_view()),
]
