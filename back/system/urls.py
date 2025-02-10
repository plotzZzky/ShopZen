from django.urls import path, include

from items.urls import items_router
from carts.urls import carts_router

urlpatterns = [
    path('', include(items_router.urls)),
    path("", include(carts_router.urls)),
]
