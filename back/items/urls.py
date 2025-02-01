from rest_framework import routers

from . import views

items_router = routers.DefaultRouter()
items_router.register(r'model', views.ItemModelView, basename='model')
items_router.register(r'pantry', views.PantryView, basename='pantry')
