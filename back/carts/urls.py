from rest_framework import routers

from . import views

carts_router = routers.DefaultRouter()
carts_router.register(r'shop', views.CartView, basename='shop')
carts_router.register(r'cart', views.ItemCartView, basename='cart')
