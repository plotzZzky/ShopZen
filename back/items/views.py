from django.http import JsonResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist

from .serializer import serialize_cart_item, serialize_pantry_item, serialize_item_model, serialize_carts
from items.models import ItemModel, CartItem, PantryItem, Cart


# Items
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_item(request):
    market = request.data.get('market', "Market")
    name = request.data['name'].title()
    validate = request.data['validate']
    item = ItemModel.objects.all().filter(name=name, market=market)
    if not item:
        ItemModel.objects.create(name=name, market=market, validate=validate)
        query = ItemModel.objects.all()
        data = [serialize_item_model(item) for item in query]
        return JsonResponse({"items": data}, status=200)
    else:
        return JsonResponse({"error": "O item já existe!"}, status=500)


# Carts
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_cart(request):
    try:
        cart_name = request.data['cartName']
        market = request.data['market']
        user = request.user
        if len(cart_name) > 2:
            Cart.objects.create(name=cart_name, user=user, market=market)
            return JsonResponse({"msg": f"Carrrinho {cart_name} criado com  sucesso!"}, status=200)
        else:
            return JsonResponse({"msg": f"O nome do carrinho deve ter mais que dois digitos!"}, status=500)
    except (KeyError, ValueError):
        return JsonResponse({"error": "Não foi possivel criar o novo carinho"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_all_carts(request):
    try:
        # Retorna a lisa de carts de determinada categoria de items
        market = request.data.get("market", "Mercado")
        user = request.user
        query = Cart.objects.filter(market=market, user=user)
        carts = serialize_carts(query)
        return JsonResponse({"carts": carts}, status=200)
    except AttributeError:
        return JsonResponse({"error": "Nenhum cart encontrado"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_your_cart(request):
    try:
        cart_id = request.data.get('cartId')
        cart = Cart.objects.get(pk=cart_id, user=request.user)
        data = [serialize_cart_item(item) for item in cart.items.all()]
        return JsonResponse({"items": data, "name": cart.name}, status=200)
    except (KeyError, ValueError, ObjectDoesNotExist):
        return JsonResponse({"items": []}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_cart(request):
    try:
        cart_id = request.data['cartId']
        cart = Cart.objects.get(pk=cart_id, user=request.user)
        cart.delete()
        return JsonResponse({"msg": "Cart deletado"}, status=200)
    except (KeyError, ValueError, ObjectDoesNotExist):
        return JsonResponse({"error": "Não foi possivel deletar o cart"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_item_to_cart(request):
    try:
        user = request.user
        cart_id = request.data['cartId']
        item_id = request.data['itemId']

        cart = Cart.objects.get(pk=cart_id, user=user)
        item_model = ItemModel.objects.get(pk=item_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item_model, amount=1)
        if not created:
            cart_item.amount += 1
            cart_item.save()
            return JsonResponse({"msg": "quantidade aumentada"}, status=200)
        else:

            cart.items.add(cart_item)
            return JsonResponse({"result": "Item adicionado"})
    except (KeyError, ValueError):
        return JsonResponse({"result": "Item Não encontrado"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_item_to_cart(request):
    try:
        cart_id = request.data['cartId']
        cart = Cart.objects.get(pk=cart_id)
        item_id = request.data['itemId']
        item = cart.items.all().get(pk=item_id)
        amount = request.data['amount']
        if int(amount) > 0:
            item.amount = amount
            item.save()
            return JsonResponse({"msg": "Item adicionado"}, status=200)
        else:
            item.delete()
            return JsonResponse({"msg": "Item removido"}, status=200)
    except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
        return JsonResponse({"error": "Item Não encontrado"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_list(request):
    try:
        cart_id = request.data['cartId']
        cart = Cart.objects.get(pk=cart_id)
        pantry = request.user.pantry
        for item in cart.items.all():
            for _ in range(item.amount):
                pantry_item = PantryItem(item=item.item, pantry=pantry, date=None)
                pantry_item.save()
                pantry.items.add(pantry_item)
            item.delete()
        return JsonResponse({"msg": "Lista comprada"}, status=200)
    except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
        return JsonResponse({"error": "Não foi possivel comprar lista!"}, status=500)


# Pantry
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_your_pantry(request):
    market = request.data.get("market", "Mercado")
    query = request.user.pantry.items.all()
    filtered = [x for x in query if x.item.market == market]
    data = [serialize_pantry_item(item) for item in filtered]
    return JsonResponse({"items": data}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_pantry(request):
    try:
        item_id = request.data['itemId']
        pantry_item = PantryItem.objects.get(pk=item_id)
        pantry_item.delete()
        return JsonResponse({"msg": "Item removido"}, status=200)
    except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
        return JsonResponse({"error": "Item Não encontrado"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_date(request):
    try:
        item_id = request.data['itemId']
        date = request.data['date']
        item = request.user.pantry.items.get(pk=item_id)
        item.date = date
        item.save()
        return JsonResponse({"msg": "Item removido"}, status=200)
    except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
        return JsonResponse({"error": "Item Não encontrado"}, status=500)
