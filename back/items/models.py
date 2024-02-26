from django.db import models
from django.contrib.auth.models import User


# Modelo do item base, usado para criar os item para compra e da dispensa
class ItemModel(models.Model):
    name = models.CharField(max_length=255)
    market = models.CharField(max_length=255)
    validate = models.PositiveIntegerField(default=1)

    objects = models.Manager()


class Cart(models.Model):
    name = models.CharField(max_length=256)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    market = models.CharField()

    objects = models.Manager()


# Cart
class CartItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)

    objects = models.Manager()


# Pantry
class Pantry(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    objects = models.Manager()


class PantryItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    pantry = models.ForeignKey(Pantry, related_name='items', on_delete=models.CASCADE)

    objects = models.Manager()
