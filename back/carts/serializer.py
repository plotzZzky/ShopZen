from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from .models import Cart, CartItem
from items.models import ItemModel
from items.serializer import ItemModelSerializer


class CartSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemCreateSerializer(ModelSerializer):
    item = PrimaryKeyRelatedField(queryset=ItemModel.objects.all())
    cart = PrimaryKeyRelatedField(queryset=Cart.objects.all())

    class Meta:
            model = CartItem
            fields = '__all__'

    def create(self, data):
        item = data.get('item')
        cart = data.get('cart')

        # Verificar se o item já existe
        existing_item = CartItem.objects.filter(item=item, cart=cart).first()

        if existing_item:
            # Se o item já existir, incrementa o amount em +1
            existing_item.amount += 1
            existing_item.save()
            return existing_item

        return CartItem.objects.create(**data)


class CartItemReturnSerializer(ModelSerializer):
    item = ItemModelSerializer()
    cart = CartSerializer()

    class Meta:
            model = CartItem
            fields = '__all__'
