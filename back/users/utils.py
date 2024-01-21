from items.models import Cart, Pantry


def create_carts(user):
    Pantry.objects.create(user=user)
    Cart.objects.create(user=user, name="Compras mercado")
    Cart.objects.create(user=user, name="Compras farmácia")
    Cart.objects.create(user=user, name="Compras petshop")
