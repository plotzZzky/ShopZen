from rest_framework import routers

from . import views

items_router = routers.DefaultRouter()
items_router.register(r'item', views.ItemModelView, basename='item')
items_router.register(r'pantry', views.PantryView, basename='pantry')
