from rest_framework import routers

from . import views

items_router = routers.DefaultRouter()
items_router.register(r'new', views.ItemModelView, basename='new')
items_router.register(r'cart', views.CartView, basename='cart')
items_router.register(r'item', views.ItemCartView, basename='item')
items_router.register(r'pantry', views.PantryView, basename='pantry')
