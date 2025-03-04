from django.urls import path

from .views import RegisterUserView, LoginUserView, UpdateUserView, DeleteUserView

urlpatterns = [
    path('users/register/', RegisterUserView.as_view(), name='register'),
    path('users/login/', LoginUserView.as_view(), name='login'),
    path('users/update/', UpdateUserView.as_view(), name='update_user'),
    path('users/delete/', DeleteUserView.as_view(), name='delete_user'),

]
