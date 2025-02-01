from rest_framework import routers

from . import views

carts_router = routers.DefaultRouter()
carts_router.register(r'cart', views.CartView, basename='cart')
carts_router.register(r'item', views.ItemCartView, basename='item')
