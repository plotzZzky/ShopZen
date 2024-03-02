from rest_framework import routers

from . import views


users_router = routers.DefaultRouter()
users_router.register(r'login', views.LoginView, basename='login')
users_router.register(r'register', views.RegisterView, basename='register')
users_router.register(r'logout', views.LogoutView, basename='logout')
users_router.register(r'recovery', views.RecoveryPassword, basename='recovery')
users_router.register(r'question', views.ReceiverYourQuestion, basename='question')
