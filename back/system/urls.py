from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from django.conf import settings

from items.urls import items_router
from users.urls import users_router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include(users_router.urls)),
    path('shop/', include(items_router.urls)),
    path('media/<path:path>/', serve, {'document_root': settings.MEDIA_ROOT}),
]
