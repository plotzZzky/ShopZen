from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist

from .serializer import CartSerializer, CartItemSerializer
from .models import ItemModel, Cart, CartItem
from system.utils import check_profanity
from items.models import Pantry, PantryItem


# Carts
class CartView(ModelViewSet):
    """ ClassView dos CartModel """
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def list(self, request, *args, **kwargs):
        """ Retorna a lista com todos os carts do usuario """
        try:
            owner: str = request.data["owner"]
            query = Cart.objects.filter(owner=owner)
            if not query:
                # Cria alguns carts pro usuario
                Cart.objects.create(name="Compras de mercado", owner=owner, market="Mercado")
                Cart.objects.create(name="Compras de farmácia", owner=owner, market="Farmácia")
                Cart.objects.create(name="Compras de petshop", owner=owner, market="PetShop")

                query = Cart.objects.filter(owner=owner)

            serializer = CartSerializer(query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except (KeyError, ValueError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """ Cria um novo cart """
        try:
            if check_profanity(request):
                return Response("Termo proibido na solicitação!", status=status.HTTP_406_NOT_ACCEPTABLE)

            serializer = CartSerializer(request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)

            else:
                raise KeyError

        except (KeyError, ValueError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def buy(self, request, *args, **kwargs):
        """ Compra todos os items do cart """
        try:
            cart_id: int = request.data['cartId']
            owner: str = request.data["owner"]

            cart = Cart.objects.get(pk=cart_id)
            pantry = Pantry.objects.get(owner=owner)

            for item in cart.items.all():
                for _ in range(item.amount):
                    pantry_item = PantryItem.objects.create(item=item.item, pantry=pantry, date=None)
                    pantry.items.add(pantry_item)
                item.delete()
            return Response("Compras feitas!", status=status.HTTP_200_OK)

        except (KeyError, ValueError, ObjectDoesNotExist):
            return Response("Não foi possivel fazer as compras", status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            cart = self.get_object()
            cart.delete()
            return Response(status=status.HTTP_200_OK)

        except KeyError:
            return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)


class ItemCartView(ModelViewSet):
    """ ClassView dos items do cart baseados no item model"""
    serializer_class = CartItemSerializer
    queryset = []

    def retrieve(self, request, *args, **kwargs):
        try:
            cart_id = kwargs['pk']  # ID do cart

            cart = Cart.objects.get(pk=cart_id)
            query = CartItem.objects.filter(cart=cart)

            serializer = self.get_serializer(query, many=True)
            return Response({"items": serializer.data, "name": cart.name}, status=status.HTTP_200_OK)

        except KeyError:
            return Response(status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """ Cria um novo cart item """
        try:
            if check_profanity(request):
                return Response("Termo proibido na solicitação!", status=status.HTTP_406_NOT_ACCEPTABLE)

            serializer = CartItemSerializer(request.data, many=True)

            if serializer.is_valid():
                owner: str = request.data['owner']
                cart = Cart.objects.get(owner=owner)

                item_model_id = request.data['itemID']
                item_model = ItemModel.objects.get(pk=item_model_id)

                item, created = CartItem.objects.get_or_create(item=item_model, cart=cart)
                amount = request.data.get('amount', None)

                if not created:
                    if int(amount) == 0:
                        item.delete()
                        return Response({"msg": "Item removido da lista!"}, status=status.HTTP_200_OK)

                    item.amount = amount
                    item.save()
                    msg = f"Quantidade aumentada para {amount}"
                    return Response({"msg": msg}, status=status.HTTP_200_OK)

            else:
                return Response({"msg": "Item criado"}, status=status.HTTP_201_CREATED)

        except (TypeError, KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)