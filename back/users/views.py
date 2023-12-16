from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .validate import valid_user
from items.models import Cart, Pantry, ItemModel
from items.serializer import serialize_item_model


@api_view(['POST'])
def register_user(request):
    try:
        password = request.data['password1']
        pwd = request.data['password2']
        username = request.data['username']
        email = request.data['email']
        if valid_user(password, pwd, username, email):
            user = User(username=username, email=email, password=password)
            user.set_password(password)
            user.save()
            Cart.objects.create(user=user)  # type:ignore
            Pantry.objects.create(user=user)  # type:ignore
            user = authenticate(username=username, password=password)
            token = Token.objects.create(user=user)  # type:ignore
            query = ItemModel.objects.all()  # type:ignore
            data = [serialize_item_model(item) for item in query]
            return JsonResponse({"token": token.key, "items": data}, status=200)
        else:
            return JsonResponse({"error": "Informações incorretas!"}, status=401)
    except AttributeError or KeyError:
        return JsonResponse({"error": "Informações incorretas!"}, status=401)


@api_view(['POST'])
def login(request):
    try:
        password = request.data['password']
        username = request.data['username']
        user = authenticate(username=username, password=password)
        query = ItemModel.objects.all()  # type:ignore
        data = [serialize_item_model(item) for item in query]
        if user is not None:
            token = Token.objects.get(user=user)  # type:ignore
            return JsonResponse({"token": token.key, "items": data}, status=200)
        else:
            return JsonResponse({"error": "Login incorreto!"}, status=401)
    except KeyError:
        return JsonResponse({"error": "Login incorreto!"}, status=401)
