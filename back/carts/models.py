from django.db import models
from django.core.validators import MinLengthValidator

from items.models import ItemModel


class Cart(models.Model):
    owner = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=256, blank=False, null=False, validators=[MinLengthValidator(4)])
    market = models.CharField(max_length=128, blank=False, null=False, default="Mercado")

    objects = models.Manager()

    def save(self, *args, **kwargs):
        # Deixa o nome com a inicial maiuscula
        self.name = self.name.capitalize()  # type:ignore
        super(Cart, self).save(*args, **kwargs)


# Cart
class CartItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(default=1, blank=False, null=False)
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)

    objects = models.Manager()

    def __str__(self):
        value: str = self.item.name
        return value
