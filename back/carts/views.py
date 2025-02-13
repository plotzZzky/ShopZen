from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist

from .serializer import CartSerializer, CartItemCreateSerializer, CartItemReturnSerializer
from .models import Cart, CartItem
from system.utils import check_profanity
from items.models import Pantry, PantryItem


# Carts
class CartView(ModelViewSet):
    """ ClassView dos CartModel """
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def retrieve(self, request, *args, **kwargs):
        """ Retorna a lista com todos os carts do usuario """
        try:
            owner: str = kwargs["pk"]
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

            serializer = CartSerializer(data=request.data, many=False)
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

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)


class CartItemView(ModelViewSet):
    """ ClassView dos items do cart baseados no item model"""
    serializer_class = CartItemCreateSerializer
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

            serializer = CartItemCreateSerializer(data=request.data, many=False)

            if serializer.is_valid():
                item = serializer.save()
                result = CartItemReturnSerializer(item, many=False)
                return Response(result.data, status=status.HTTP_201_CREATED)

            else:
                return Response(status.HTTP_400_BAD_REQUEST)

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