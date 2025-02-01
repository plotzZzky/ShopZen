from rest_framework.serializers import ModelSerializer

from .models import ItemModel, PantryItem


class ItemModelSerializer(ModelSerializer):
    class Meta:
        model = ItemModel
        fields = '__all__'


class PantrySerializer(ModelSerializer):
    item = ItemModelSerializer()

    class Meta:
        model = PantryItem
        fields = '__all__'
