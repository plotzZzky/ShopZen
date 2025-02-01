from django.urls import path, include

from items.urls import items_router


urlpatterns = [
    path('', include(items_router.urls)),
]
