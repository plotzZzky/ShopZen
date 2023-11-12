from django.urls import path

from . import views


urlpatterns = [
    # Items
    path('new/', views.create_new_item),
    # Cart
    path('cart/', views.get_your_cart),
    path('cart/update/', views.update_item_to_cart),
    path('cart/add/', views.add_item_to_cart),
    path('cart/buy/', views.buy_list),
    # Pantry
    path('pantry/', views.get_your_pantry),
    path('pantry/update/', views.change_date),
    path('pantry/delete/', views.remove_from_pantry),
]
