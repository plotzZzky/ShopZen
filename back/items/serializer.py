from rest_framework.serializers import ModelSerializer

from .models import CartItem, Cart, PantryItem, ItemModel


class ItemModelSerializer(ModelSerializer):
    class Meta:
        model = ItemModel
        fields = '__all__'


class CartSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(ModelSerializer):
    item = ItemModelSerializer()

    class Meta:
        model = CartItem
        fields = '__all__'


class PantryItemSerializer(ModelSerializer):
    item = ItemModelSerializer()

    class Meta:
        model = PantryItem
        fields = '__all__'
