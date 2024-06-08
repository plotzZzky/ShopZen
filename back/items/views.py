from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist

from .serializer import ItemModelSerializer, CartSerializer, CartItemSerializer, PantryItemSerializer
from items.models import ItemModel, PantryItem, Cart, CartItem


class ItemModelView(ModelViewSet):
    """ ClassView do itemModel """
    permission_classes = [IsAuthenticated]
    serializer_class = ItemModelSerializer
    queryset = ItemModel.objects.all()

    def create(self, request, *args, **kwargs):
        """ Cria um novo item model """
        market = request.data.get('market', 'Mercado')
        name = request.data.get('name').title()
        validate = request.data.get('validate', 90)
        item, created = ItemModel.objects.get_or_create(market=market, name=name, validate=validate)
        if created:
            serializer = self.get_serializer(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"msg": "O item já existe por isso não foi criado"}, status=status.HTTP_400_BAD_REQUEST)


# Carts
class CartView(ModelViewSet):
    """ ClassView dos CartModel """
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def list(self, request, *args, **kwargs):
        user = request.user
        query = Cart.objects.filter(user=user)
        serializer = CartSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """ Cria um novo cart """
        try:
            cart_name = request.data['cartName']
            market = request.data['market']
            user = request.user
            if len(cart_name) > 2:
                Cart.objects.create(name=cart_name, user=user, market=market)
                return Response({"msg": f"Carrrinho {cart_name} criado com  sucesso!"}, status=status.HTTP_200_OK)
            else:
                msg = "O nome do carrinho deve ter mais que dois digitos!"
                return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)
        except (KeyError, ValueError):
            msg = "Não foi possivel criar o novo carinho"
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def buy(self, request, *args, **kwargs):
        """ Compra todos os items do cart """
        try:
            cart_id = request.data['cartId']
            cart = Cart.objects.get(pk=cart_id)
            pantry = request.user.pantry
            for item in cart.items.all():
                for _ in range(item.amount):
                    pantry_item = PantryItem.objects.create(item=item.item, pantry=pantry, date=None)
                    pantry.items.add(pantry_item)
                item.delete()
            return Response({"msg": "Carrinho de compras comprado!"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Não foi possivel fazer as compras"}, status=status.HTTP_400_BAD_REQUEST)


class ItemCartView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    queryset = []

    def retrieve(self, request, *args, **kwargs):
        cart_id = kwargs['pk']  # ID do cart
        cart = Cart.objects.get(pk=cart_id)
        query = CartItem.objects.filter(cart=cart)
        serializer = self.get_serializer(query, many=True)

        data = {"items": serializer.data, "name": cart.name}
        return Response(data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """ Cria um novo cart item """
        try:
            cart_id = request.data['cartId']
            item_id = request.data['itemId']
            amount = request.data.get('amount', None)
            user = request.user

            cart = Cart.objects.get(pk=cart_id, user=user)
            item_model = ItemModel.objects.get(pk=item_id)
            item, created = CartItem.objects.get_or_create(item=item_model, cart=cart)
            if not created:
                if amount:
                    if int(amount) != 0:
                        item.amount = amount
                        item.save()
                        return Response({"msg": f"Quantidade aumentada para {amount}"}, status=status.HTTP_200_OK)
                    elif int(amount) == 0:
                        item.delete()
                        return Response({"msg": "Item removido da lista!"}, status=status.HTTP_200_OK)
                else:
                    item.amount += 1
                    item.save()
                    return Response({"msg": "Item adicionado"}, status=status.HTTP_200_OK)
            else:
                return Response({"msg": "Item criado"}, status=status.HTTP_201_CREATED)
        except (TypeError, KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)


class PantryView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PantryItemSerializer
    queryset = PantryItem.objects.all()

    @action(detail=False, methods=['POST'])
    def all(self, request, *args, **kwargs):
        """ Retorna a lista com todos os items da dispensa """
        market = request.data.get('market', "Mercado")
        query = PantryItem.objects.filter(item__market=market)
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """ Atualiza um item na dispensa """
        try:
            date = request.data['date']
            item = self.get_object()
            item.date = date
            item.save()
            return Response({"msg": "Item removido"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
            return Response({"error": "Item Não encontrado"}, status=status.HTTP_400_BAD_REQUEST)
