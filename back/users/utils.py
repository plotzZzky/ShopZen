from items.models import Cart, Pantry


def create_carts(user):
    Pantry.objects.create(user=user)
    Cart.objects.create(user=user, name="Compras mercado", market='Mercado')
    Cart.objects.create(user=user, name="Compras farmácia", market="Farmacia")
    Cart.objects.create(user=user, name="Compras petshop", market="PetShop")
