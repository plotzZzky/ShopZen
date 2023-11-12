from django.contrib import admin

from .models import ItemModel, Cart, CartItem, Pantry, PantryItem


admin.site.register(ItemModel)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Pantry)
admin.site.register(PantryItem)
