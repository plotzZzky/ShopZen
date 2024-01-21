from django.urls import path

from . import views


urlpatterns = [
    # Items
    path('new/', views.create_new_item),
    # Cart
    path("carts/", views.get_all_carts),
    path('cart/', views.get_your_cart),
    path("cart/new/", views.create_new_cart),
    path('cart/update/', views.update_item_to_cart),
    path('cart/add/', views.add_item_to_cart),
    path('cart/buy/', views.buy_list),
    path('cart/del/', views.delete_cart),
    # Pantry
    path('pantry/', views.get_your_pantry),
    path('pantry/update/', views.change_date),
    path('pantry/delete/', views.remove_from_pantry),
]
