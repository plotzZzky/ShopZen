from rest_framework.serializers import ModelSerializer

from .models import Cart, CartItem
from items.serializer import ItemModelSerializer


class CartSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(ModelSerializer):
    item = ItemModelSerializer()

    class Meta:
        model = CartItem
        fields = '__all__'
