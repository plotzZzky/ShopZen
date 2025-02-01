from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

from .serializer import ItemModelSerializer, PantrySerializer
from .models import ItemModel, Pantry, PantryItem
from system.utils import check_profanity


class ItemModelView(ModelViewSet):
    """ ClassView do modelo de item model de referencia com as proriedades basicas """
    serializer_class = ItemModelSerializer
    queryset = ItemModel.objects.all()

    def list(self, request, *args, **kwargs):
        """ Envia a lista com todos os items """
        items = self.get_queryset()
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """ Cria um novo item model """
        try:
            if check_profanity(request):
                return Response("Termo proibido na solicitação!", status=status.HTTP_406_NOT_ACCEPTABLE)

            serializer = ItemModelSerializer(request.data, many=False)
            if serializer.is_valid():
                market = request.data.get('market', 'Mercado')
                name = request.data.get('name').title()

                try:
                    # Verifica se o item já existe, se não, cria o item
                    ItemModel.objects.gete(market=market, name=name)
                    return Response("Item já existe", status=status.HTTP_200_OK)

                except ObjectDoesNotExist:
                    item = serializer.save()
                    data = ItemModelSerializer(item).data
                    return Response(data, status=status.HTTP_201_CREATED)

            else:
                raise KeyError # Gera um keyerror se o serializer for invalido

        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)


# Pantry view
class PantryView(ModelViewSet):
    """ ClassView do items da Pantry(dispensa)"""
    serializer_class = PantrySerializer
    queryset = Pantry.objects.all()

    def retrieve(self, request, *args, **kwargs):
        """ Retorna a lista com todos os items da dispensa """
        query, created = Pantry.objects.get_or_create()
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """ Atualiza um item na dispensa """
        try:
            date = request.data['date']
            item = self.get_object()
            item.date = date
            item.save()
            return Response({"msg": "Item Atualizado"}, status=status.HTTP_200_OK)
        except (KeyError, ValueError, TypeError, ObjectDoesNotExist):
            return Response({"error": "Item Não encontrado"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            item = self.get_object()
            item.delete()
            return Response(status=status.HTTP_200_OK)

        except KeyError:
            return Response(status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)
