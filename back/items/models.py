from django.db import models


class ItemModel(models.Model):
    # Modelo do item base, usado para criar os items para compra e da dispensa
    name = models.CharField(max_length=255, blank=False, null=False)
    market = models.CharField(max_length=255, default="Mercado", blank=False, null=False)
    validate = models.PositiveIntegerField(default=90, blank=False, null=False)

    objects = models.Manager()

    def save(self, *args, **kwargs):
        # Deixa o nome com a inicial maiuscula
        self.name = self.name.capitalize()  # type:ignore
        super(ItemModel, self).save(*args, **kwargs)

    def __str__(self):
        value: str = f"{self.name} - {self.market}"
        return value


# Pantry
class Pantry(models.Model):
    owner = models.CharField(max_length=255, blank=True, null=True)

    objects = models.Manager()


class PantryItem(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    pantry = models.ForeignKey(Pantry, related_name='items', on_delete=models.CASCADE)

    objects = models.Manager()
