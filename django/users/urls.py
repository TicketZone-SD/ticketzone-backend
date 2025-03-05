from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterUserView, LoginUserView, UpdateUserView, DeleteUserView, ListUsersView, RetrieveUserView

urlpatterns = [
    path('users/register/', RegisterUserView.as_view(), name='register'),
    path('users/login/', LoginUserView.as_view(), name='login'),
    path('users/update/', UpdateUserView.as_view(), name='update_user'),
    path('users/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('users/', ListUsersView.as_view(), name='list_users'),  
    path('users/<int:pk>/', RetrieveUserView.as_view(), name='retrieve_user'), 

    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
