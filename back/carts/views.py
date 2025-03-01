from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist

from .serializer import CartSerializer, CartItemCreateSerializer, CartItemReturnSerializer
from items.serializer import PantrySerializer
from .models import Cart, CartItem
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
            owner: str = request.owner
            query = Cart.objects.filter(owner=owner)

            if not query:
                # Se não houver nenhum cria alguns carts pro usuario
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

            data = request.data.copy() # cria uma copia para poder adicionar o owner
            data["owner"] = request.owner

            serializer = CartSerializer(data=data, many=False)

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
            owner: str = request.owner

            cart = Cart.objects.get(pk=cart_id)
            pantry, created = Pantry.objects.get_or_create(owner=owner)

            for item in cart.items.all():
                for _ in range(item.amount):
                    pantry_item = PantryItem.objects.create(item=item.item, pantry=pantry, date=None)
                    pantry.items.add(pantry_item)
                item.delete()

            pantry = Pantry.objects.get(owner=owner)
            serializer = PantrySerializer(pantry.items.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

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


class CartItemView(ModelViewSet):
    """ ClassView dos items do cart baseados no item model"""
    serializer_class = CartItemCreateSerializer
    queryset = CartItem.objects.all()

    def retrieve(self, request, *args, **kwargs):
        try:
            cart_id = kwargs['pk']  # ID do cart

            cart = Cart.objects.get(pk=cart_id)
            query = CartItem.objects.filter(cart=cart)

            serializer = CartItemReturnSerializer(query, many=True)
            result = {"items": serializer.data, "name": cart.name, "market": cart.market}
            return Response(result, status=status.HTTP_200_OK)

        except KeyError:
            return Response(status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """ Cria um novo cart item """
        try:
            serializer = CartItemCreateSerializer(data=request.data, many=False)

            if serializer.is_valid():
                item = serializer.save()
                result = CartItemReturnSerializer(item, many=False)
                return Response(result.data, status=status.HTTP_201_CREATED)

            else:
                return Response(status.HTTP_400_BAD_REQUEST)

        except (TypeError, KeyError, ValueError, ObjectDoesNotExist):
            return Response({"error": "Formulario incorreto"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        try:
            cart_item = self.get_object()
            serializer = CartItemCreateSerializer(cart_item, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(status.HTTP_200_OK)

            return Response(status.HTTP_400_BAD_REQUEST)
        except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
            return Response(status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        item_id = kwargs['pk']
        item = CartItem.objects.get(pk=item_id)

        if item:
            item.delete()
            return Response(status.HTTP_200_OK)

        return Response(status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
