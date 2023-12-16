from django.http import JsonResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .serializer import serialize_cart_item, serialize_pantry_item, serialize_item_model
from items.models import ItemModel, CartItem, PantryItem


# Items
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_item(request):
    market = request.data['market']
    name = request.data['name'].title()
    validate = request.data['validate']
    items = ItemModel.objects.all()  # type:ignore
    for item in items:
        if item.name == name:
            query = ItemModel.objects.all()  # type:ignore
            data = [serialize_item_model(item) for item in query]
            return JsonResponse({"items": data})
    ItemModel.objects.create(name=name, market=market, validate=validate)  # type:ignore
    query = ItemModel.objects.all()  # type:ignore
    data = [serialize_item_model(item) for item in query]
    return JsonResponse({"items": data})


# Cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_your_cart(request):
    try:
        market = request.data.get('market') or "Mercado"
        query = request.user.cart.items.all()  # type: ignore
        filtered = [x for x in query if x.item.market == market]
        data = [serialize_cart_item(item) for item in filtered]
        return JsonResponse({"items": data})
    except KeyError or ValueError:
        return JsonResponse({"items": []}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_item_to_cart(request):
    try:
        item_id = request.data['id']
        item_model = ItemModel.objects.get(pk=item_id)  # type:ignore
        cart = request.user.cart.items
        for x in cart.all():
            if item_model == x.item:
                x.amount += 1
                x.save()
                return JsonResponse({"result": "Item adicionado"}, status=200)
        cart_item = CartItem.objects.create(item=item_model, amount=1)  # type:ignore
        cart.add(cart_item)
        return JsonResponse({"result": "Item adicionado"})
    except (KeyError, ValueError, ItemModel.DoesNotExist):  # type:ignore
        return JsonResponse({"result": "Item Não encontrado"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_item_to_cart(request):
    try:
        amount = request.data['amount']
        item_id = request.data['id']
        cart_item = get_object_or_404(request.user.cart.items, id=item_id)
        if amount != '' and amount != '0':
            cart_item.amount = amount
            cart_item.save()
            return JsonResponse({"result": "Item adicionado"}, status=200)
        else:
            cart_item.delete()
            return JsonResponse({"result": "Item removido"}, status=200)
    except (KeyError, ValueError, TypeError, CartItem.DoesNotExist):  # type:ignore
        return JsonResponse({"result": "Item Não encontrado"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_list(request):
    try:
        market = request.data['market']
        cart = request.user.cart.items
        pantry = request.user.pantry
        markets = ["Mercado", "Farmacia"]
        if market in markets:
            for x in cart.all():
                if x.item.market == market:
                    for _ in range(x.amount):
                        pantry_item = PantryItem(item=x.item, pantry=pantry, date=None)
                        pantry_item.save()
                        pantry.items.add(pantry_item)
                    x.delete()
                    cart.remove(x)
            return JsonResponse({"result": "Lista comprado"}, status=200)
        else:
            return JsonResponse({"result": "Não foi possivel comprar lista!"}, status=404)
    except (KeyError, ValueError, TypeError, PantryItem.DoesNotExist):  # type:ignore
        return JsonResponse({"result": "Não foi possivel comprar lista!"}, status=404)


# Pantry
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_your_pantry(request):
    market = request.data.get('market') or "Mercado"
    query = request.user.pantry.items.all()  # type: ignore
    filtered = [x for x in query if x.item.market == market]
    data = [serialize_pantry_item(item) for item in filtered]
    return JsonResponse({"items": data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_pantry(request):
    try:
        item_id = request.data['id']
        if item_id != "" or " ":
            pantry_item = get_object_or_404(request.user.pantry.items, id=item_id)
            pantry_item.delete()
            return JsonResponse({"result": "Item removido"}, status=200)
        else:
            return JsonResponse({"result": "Item Não encontrado"}, status=404)
    except (KeyError, ValueError, TypeError, PantryItem.DoesNotExist):  # type:ignore
        return JsonResponse({"result": "Item Não encontrado"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_date(request):
    try:
        item_id = request.data['id']
        date = request.data['date']
        pantry_item = get_object_or_404(request.user.pantry.items, id=item_id)
        pantry_item.date = date
        pantry_item.save()
        return JsonResponse({"result": "Item removido"}, status=200)
    except (KeyError, ValueError, TypeError, PantryItem.DoesNotExist):  # type:ignore
        return JsonResponse({"result": "Item Não encontrado"}, status=404)
