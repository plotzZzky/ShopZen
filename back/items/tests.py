from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from .models import ItemModel, Cart, CartItem, Pantry, PantryItem


class CartTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        # Create User
        self.user = User.objects.create_user(**self.credentials)

        self.market_cart = Cart.objects.create(user=self.user, name='Test', market="Mercado")

        self.pantry = Pantry.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.create_first_item_model()

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)
        self.rice_cart = CartItem.objects.create(item=self.rice, amount=1, cart=self.market_cart)
        self.market_cart.items.add(self.rice_cart)

        self.pasta = ItemModel.objects.create(name="Macarrão", market="Mercado", validate=90)
        self.pasta_cart = CartItem.objects.create(item=self.pasta, amount=1, cart=self.market_cart)
        self.market_cart.items.add(self.pasta_cart)

        self.soap = ItemModel.objects.create(name="Sabonete", market="Farmacia", validate=120)
        self.soap_cart = CartItem.objects.create(item=self.soap, amount=1, cart=self.market_cart)
        self.market_cart.items.add(self.soap_cart)

    # Get your cart
    def test_get_all_carts(self):
        response = self.client.post("/shop/cart/all/")
        self.assertEqual(response.status_code, 200)

    def test_get_your_cart(self):
        cart_id = self.market_cart.id
        response = self.client.get(f'/shop/cart/{cart_id}/')
        self.assertEqual(response.status_code, 200)

    def test_get_your_cart_id_error(self):
        response = self.client.get(f'/shop/cart/{99999}/')
        self.assertEqual(response.status_code, 404)

    def test_get_your_cart_no_login(self):
        self.client.credentials()
        response = self.client.post('/shop/cart/')
        self.assertEqual(response.status_code, 401)

    # Create Cart
    def test_create_cart(self):
        data = {"cartName": "Test de cart", "market": "Mercado"}
        response = self.client.post('/shop/cart/', data)
        self.assertEqual(response.status_code, 200)

    def test_create_cart_no_data(self):
        response = self.client.post('/shop/cart/')
        self.assertEqual(response.status_code, 400)

    def test_create_cart_errors(self):
        datas = [
            {"market": "Mercado"},
            {"cartName": "", "market": "Mercado"},
            {},
        ]
        for data in datas:
            response = self.client.post('/shop/cart/', data)
            self.assertEqual(response.status_code, 400)

    # Delete Cart
    def test_delete_cart(self):
        cart_id = Cart.objects.filter(user=self.user)[0].id
        response = self.client.delete(f'/shop/cart/{cart_id}/')
        self.assertEqual(response.status_code, 204)

    def test_delete_cart_id_9999(self):
        response = self.client.delete(f'/shop/cart/{9999}/')
        self.assertEqual(response.status_code, 404)

    def test_delete_cart_id_string(self):
        response = self.client.delete('/shop/cart/9999/')
        self.assertEqual(response.status_code, 404)

    def test_delete_cart_no_login(self):
        self.client.credentials()
        response = self.client.post(f'/shop/cart/{999}/')
        self.assertEqual(response.status_code, 401)

    # Add new item
    def test_add_new_item(self):
        data = {"itemId": 1, "cartId": 1}
        response = self.client.post('/shop/item/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_add_new_item_no_login(self):
        self.client.credentials()
        response = self.client.post('/shop/item/')
        self.assertEqual(response.status_code, 401)

    def test_add_new_item_no_data(self):
        response = self.client.post('/shop/item/')
        self.assertEqual(response.status_code, 400)

    def test_add_new_item_id_as_string(self):
        cart = Cart.objects.get(user=self.user)
        data = {"itemId": "", "cartId": cart.id}
        response = self.client.post('/shop/item/', data)
        self.assertEqual(response.status_code, 400)

    def test_add_new_item_id_9999(self):
        data = {"itemId": 999999}
        response = self.client.post('/shop/item/', data)
        self.assertEqual(response.status_code, 400)

    def test_add_new_item_twice(self):
        cart = Cart.objects.get(user=self.user)
        items = cart.items.all()
        item_id = items[0].id
        data = {"itemId": item_id, "cartId": cart.id}

        self.client.post('/shop/item/', data)
        response = self.client.post('/shop/item/', data)

        cart_item = CartItem.objects.get(pk=item_id)
        self.assertEqual(cart_item.amount, 3)
        self.assertEqual(response.status_code, 200)

    # Update amount to cart
    def test_change_amount_5(self):
        cart = Cart.objects.filter(user=self.user)
        items = cart[0].items.all()
        item_id = items[0].id
        data = {"cartId": cart[0].id, "itemId": item_id, "amount": 5}
        response = self.client.post('/shop/item/', data)
        cart_item = CartItem.objects.get(pk=item_id)
        self.assertEqual(cart_item.amount, 5)
        self.assertEqual(response.status_code, 200)

    def test_change_amount_0(self):
        cart = Cart.objects.filter(user=self.user)
        items = cart[0].items.all()
        item_id = items[0].id
        data = {"cartId": cart[0].id, "itemId": item_id, "amount": 0}
        response = self.client.post('/shop/item/', data)
        try:
            cart_item = CartItem.objects.get(pk=item_id)
        except CartItem.DoesNotExist:  # type:ignore
            cart_item = None
        self.assertIsNone(cart_item)
        self.assertEqual(response.status_code, 200)

    def test_change_amount_no_login(self):
        self.client.credentials()
        response = self.client.post('/shop/item/')
        self.assertEqual(response.status_code, 401)

    def test_change_amount_no_id(self):
        data = {"amount": 0}
        response = self.client.post('/shop/item/', data)
        self.assertEqual(response.status_code, 400)

    # Buy List
    def test_buy_cart(self):
        cart_id = self.market_cart.id
        data = {"cartId": cart_id}
        response = self.client.post('/shop/cart/buy/', data)
        cart = self.market_cart.items.all()
        result = True if len(cart) == 0 else False
        self.assertTrue(result)
        self.assertEqual(response.status_code, 200)

    def test_buy_cart_no_data(self):
        response = self.client.post('/shop/cart/buy/')
        self.assertEqual(response.status_code, 400)

    def test_buy_cart_data_empty(self):
        data = {"cartId": ""}
        response = self.client.post('/shop/cart/buy/', data)
        self.assertEqual(response.status_code, 400)


# Pantry
class PantryTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        # Create User
        self.user = User.objects.create_user(**self.credentials)

        self.market_cart = Cart.objects.create(user=self.user, name='Test', market="Mercado")

        self.pantry = Pantry.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.create_first_item_model()

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)
        self.rice_cart = PantryItem.objects.create(item=self.rice, date=None, pantry=self.pantry)
        self.pantry.items.add(self.rice_cart)

        self.pasta = ItemModel.objects.create(name="Macarrão", market="Mercado", validate=90)
        self.pasta_cart = PantryItem.objects.create(item=self.pasta, date=None, pantry=self.pantry)
        self.pantry.items.add(self.pasta_cart)

        self.soap = ItemModel.objects.create(name="Sabonete", market="Farmacia", validate=120)
        self.soap_cart = PantryItem.objects.create(item=self.soap, date=None, pantry=self.pantry)
        self.pantry.items.add(self.soap_cart)

    # Get your Pantry
    def test_get_your_pantry(self):
        markets = ["Mercado", "Farmacia", "PetShop"]
        for item in markets:
            data = {"market": item}
            response = self.client.post('/shop/pantry/all/', data)
            self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_empty(self):
        data = {"market": ""}
        response = self.client.post('/shop/pantry/all/', data)
        self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_no_data(self):
        response = self.client.post('/shop/pantry/all/')
        self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_no_login(self):
        self.client.credentials()
        response = self.client.post('/shop/pantry/all/')
        self.assertEqual(response.status_code, 401)

    # Remove from pantry
    def test_remove_from_your_pantry(self):
        items = self.user.pantry.items.all()
        new_id = items[1].id
        response = self.client.delete(f'/shop/pantry/{new_id}/')
        self.assertEqual(response.status_code, 204)

    def test_remove_from_your_pantry_errors(self):
        ids_to_test = [0, -1, 999, 'a', '', 9999999]

        for item_id in ids_to_test:
            response = self.client.delete(f'/ishop/pantry/{item_id}/')
            self.assertEqual(response.status_code, 404)

    # Update validate
    def test_pantry_update_date(self):
        items = self.user.pantry.items.all()
        item_id = items[1].id
        data = {"date": '2023-09-28'}
        response = self.client.patch(f'/shop/pantry/{item_id}/', data)
        self.assertEqual(response.status_code, 200)

    def test_pantry_update_date_errors(self):
        ids_to_test = [0, -1, 999, 'a', '']
        for item_id in ids_to_test:
            data = {"date": '2023-09-28'}
            response = self.client.patch(f'/shop/pantry/{item_id}/', data)
            self.assertEqual(response.status_code, 404)


# Pantry
class ItemModelTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        # Create User
        self.user = User.objects.create_user(**self.credentials)

        self.market_cart = Cart.objects.create(user=self.user, name='Test', market="Mercado")

        self.pantry = Pantry.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.create_first_item_model()

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)  # type:ignore

    # Get your Pantry
    def test_create_item_model(self):
        data = {"name": "Name", "market": "Mercado", "Validate": 90}
        response = self.client.post('/shop/new/', data)
        self.assertEqual(response['Content-Type'], 'application/json')
        self.assertEqual(response.status_code, 201)

