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
        self.cart = Cart.objects.create(user=self.user)  # type:ignore
        self.pantry = Pantry.objects.create(user=self.user)  # type:ignore
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.create_first_item_model()

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)  # type:ignore
        self.rice_cart = CartItem.objects.create(item=self.rice, amount=1)  # type:ignore
        self.user.cart.items.add(self.rice_cart)
        self.soap = ItemModel.objects.create(name="Sabonete", market="Farmacia", validate=120)  # type:ignore
        self.soap_cart = CartItem.objects.create(item=self.soap, amount=1)  # type:ignore
        self.user.cart.items.add(self.soap_cart)

    # Get your cart
    def test_get_your_cart_mercado(self):
        data = {"market": "Mercado"}
        response = self.client.post('/items/cart/', data)
        self.assertEqual(response.status_code, 200)

    def test_get_your_cart_farmacia(self):
        data = {"market": "Farmacia"}
        response = self.client.post('/items/cart/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_get_your_cart_empty(self):
        data = {"market": ""}
        response = self.client.post('/items/cart/', data)
        self.assertEqual(response.status_code, 200)

    def test_get_your_cart_no_data(self):
        response = self.client.post('/items/cart/')
        self.assertEqual(response.status_code, 200)

    def test_get_your_cart_no_login(self):
        self.client.credentials()
        response = self.client.post('/items/cart/')
        self.assertEqual(response.status_code, 401)

    # Add new item
    def test_add_new_item_to_cart(self):
        data = {"id": 1}
        response = self.client.post('/items/cart/add/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_add_new_item_to_cart_no_login(self):
        data = {"id": 1}
        self.client.credentials()
        response = self.client.post('/items/cart/add/', data)
        self.assertEqual(response.status_code, 401)

    def test_add_new_item_to_cart_no_data(self):
        response = self.client.post('/items/cart/add/')
        self.assertEqual(response.status_code, 404)

    def test_add_new_item_to_cart_data_as_string(self):
        data = {"id": ""}
        response = self.client.post('/items/cart/add/', data)
        self.assertEqual(response.status_code, 404)

    def test_add_new_item_to_cart_id_9999(self):
        data = {"id": 999999}
        response = self.client.post('/items/cart/add/', data)
        self.assertEqual(response.status_code, 404)

    # Update amount to cart
    def test_change_amount_5(self):
        items = self.user.cart.items.all()
        new_id = items[1].id
        data = {"id": new_id, "amount": 5}
        response = self.client.post('/items/cart/update/', data)
        cart = self.user.cart.items.all()
        result = True if self.soap_cart in cart else False
        self.assertTrue(result)
        self.assertEqual(response.status_code, 200)

    def test_change_amount_0(self):
        items = self.user.cart.items.all()
        new_id = items[1].id
        data = {"id": new_id, "amount": 0}
        response = self.client.post('/items/cart/update/', data)
        cart = self.user.cart.items.all()
        result = True if self.soap_cart in cart else False
        self.assertFalse(result)
        self.assertEqual(response.status_code, 200)

    def test_change_amount_empty(self):
        items = self.user.cart.items.all()
        new_id = items[1].id
        data = {"id": new_id, "amount": 0}
        response = self.client.post('/items/cart/update/', data)
        cart = self.user.cart.items.all()
        result = True if self.soap_cart in cart else False
        self.assertFalse(result)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_change_amount_no_login(self):
        data = {"id": 1, "amount": 0}
        self.client.credentials()
        response = self.client.post('/items/cart/update/', data)
        self.assertEqual(response.status_code, 401)

    def test_change_amount_errors(self):
        ids_to_test = [0, -1, 999, 'a', '', ]

        for item_id in ids_to_test:
            data = {"id": item_id, "date": '2023-09-28'}
            # print(f"ID - {item_id}")
            response = self.client.post('/items/cart/update/', data)
            self.assertEqual(response.status_code, 404)

    def test_change_amount_no_id(self):
        data = {"amount": 0}
        response = self.client.post('/items/cart/update/', data)
        self.assertEqual(response.status_code, 404)

    # Buy List
    def test_buy_list_mercado(self):
        data = {"market": "Mercado"}
        response = self.client.post('/items/cart/buy/', data)
        cart = self.user.cart.items.all()
        # len == 1 pq tem o item de farmacia que é 'comprado' separado
        result = True if len(cart) == 1 else False
        self.assertTrue(result)
        self.assertEqual(response.status_code, 200)

    def test_buy_list_farmacia(self):
        data = {"market": "Farmacia"}
        response = self.client.post('/items/cart/buy/', data)
        cart = self.user.cart.items.all()
        # len == 1 pq tem o item de mercado que é 'comprado' separado
        result = True if len(cart) == 1 else False
        self.assertTrue(result)
        self.assertEqual(response.status_code, 200)

    # Error
    def test_buy_list_no_data(self):
        response = self.client.post('/items/cart/buy/')
        cart = self.user.cart.items.all()
        self.assertEqual(response.status_code, 404)

    def test_buy_list_data_empty(self):
        data = {"market": " "}
        response = self.client.post('/items/cart/buy/', data)
        cart = self.user.cart.items.all()
        self.assertEqual(response.status_code, 404)


# Pantry
class PantryTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        # Create User
        self.user = User.objects.create_user(**self.credentials)
        self.cart = Cart.objects.create(user=self.user)  # type:ignore
        self.pantry = Pantry.objects.create(user=self.user)  # type:ignore
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.create_first_item_model()

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)  # type:ignore
        self.rice_cart = PantryItem.objects.create(item=self.rice, date=None)  # type:ignore
        self.user.pantry.items.add(self.rice_cart)
        self.soap = ItemModel.objects.create(name="Sabonete", market="Farmacia", validate=120)  # type:ignore
        self.soap_cart = PantryItem.objects.create(item=self.soap, date=None)  # type:ignore
        self.user.pantry.items.add(self.soap_cart)

    # Get your Pantry
    def test_get_your_pantry_mercado(self):
        data = {"market": "Mercado"}
        response = self.client.post('/items/pantry/', data)
        self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_farmacia(self):
        data = {"market": "Farmacia"}
        response = self.client.post('/items/pantry/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_get_your_pantry_empty(self):
        data = {"market": ""}
        response = self.client.post('/items/pantry/', data)
        self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_no_data(self):
        response = self.client.post('/items/pantry/')
        self.assertEqual(response.status_code, 200)

    def test_get_your_pantry_no_login(self):
        self.client.credentials()
        response = self.client.post('/items/pantry/')
        self.assertEqual(response.status_code, 401)

    # Remove from pantry
    def test_remove_from_your_pantry(self):
        items = self.user.pantry.items.all()
        new_id = items[1].id
        data = {"id": new_id}
        response = self.client.post('/items/pantry/delete/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_remove_from_your_pantry_no_data(self):
        response = self.client.post('/items/pantry/delete/')
        self.assertEqual(response.status_code, 404)

    def test_remove_from_your_pantry_errors(self):
        ids_to_test = [0, -1, 999, 'a', '', ]

        for item_id in ids_to_test:
            data = {"id": item_id, "date": '2023-09-28'}
            # print(f"ID - {item_id}")
            response = self.client.post('/items/pantry/delete/', data)
            self.assertEqual(response.status_code, 404)

    # Update validate
    def test_pantry_update_date(self):
        items = self.user.pantry.items.all()
        new_id = items[1].id
        data = {"id": new_id, "date": '2023-09-28'}
        response = self.client.post('/items/pantry/update/', data)
        self.assertEqual(response.status_code, 200)

    # Errors
    def test_pantry_update_date_errors(self):
        ids_to_test = [0, -1, 999, 'a', '']
        # print(f"ID - {item_id}")
        for item_id in ids_to_test:
            data = {"id": item_id, "date": '2023-09-28'}
            response = self.client.post('/items/pantry/update/', data)
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
        self.cart = Cart.objects.create(user=self.user)  # type:ignore
        self.pantry = Pantry.objects.create(user=self.user)  # type:ignore
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def create_first_item_model(self):
        self.rice = ItemModel.objects.create(name="Arroz", market="Mercado", validate=90)  # type:ignore

    # Get your Pantry
    def test_create_item_model(self):
        data = {"name": "Name", "market": "Mercado", "Validate": 90}
        response = self.client.post('/items/pantry/', data)
        result = True if 'items' in response.json() else False
        self.assertTrue(result)
        self.assertEqual(response.status_code, 200)

    def test_create_item_model_errors(self):
        datas = [
            {"name": "Name", "market": "Mercado", "Validate": '90'},
            {"name": "Name", "market": "Mercado", "Validate": -90},
            {"name": "Name", "market": "Mercado"},
            {"name": 9999, "market": "Mercado", "Validate": 90},
            {"market": "Mercado", "Validate": 90},
            {"name": "Name", "market": 9999, "Validate": 90},
            {"name": "Name", "Validate": 90},
        ]

        for data in datas:
            response = self.client.post('/items/pantry/update/', data)
            self.assertEqual(response.status_code, 404)
            if response.status_code == 200:
                print(f"O test {data} apresentou erro!!")
