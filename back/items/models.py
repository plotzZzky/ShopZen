from django.db import models
from django.contrib.auth.models import User


# Item
class ItemModel(models.Model):
    name = models.CharField(max_length=255)
    market = models.CharField(max_length=128)
    validate = models.PositiveIntegerField(default=1)


# Cart
class CartItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(default=1)


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem)


# Pantry
class PantryItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)


class Pantry(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(PantryItem)
