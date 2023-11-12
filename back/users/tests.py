from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
import json


class LoginTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'temporary',
            'password': '1234x567'}
        self.client = APIClient()
        self.user = User.objects.create_user(**self.credentials)
        self.token = Token.objects.create(user=self.user)  # type:ignore
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.credentials_error = {'username': 'user_error', 'password': '12334555'}

    def test_login_status(self):
        response = self.client.post('/users/login/', self.credentials)
        self.assertEqual(response.status_code, 200)

    def test_login_content_type(self):
        response = self.client.post('/users/login/', self.credentials)
        try:
            j = json.loads(response.content)
        except Exception:
            j = False
        self.assertNotEqual(j, False)

    def test_login_content_result(self):
        response = self.client.post('/users/login/', self.credentials)
        result = json.loads(response.content)
        r = True if "items" in result else False
        self.assertTrue(r)
        self.assertEqual(result['token'], self.token.key)

    def test_login_status_error(self):
        response = self.client.post('/users/login/', self.credentials_error)
        self.assertEqual(response.status_code, 401)

    def test_login_status_error_empty(self):
        response = self.client.post('/users/login/', {})
        self.assertEqual(response.status_code, 401)


class RegisterTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'mewuser',
            'email': 'newuser@mail.com',
            'password1': '1234x567',
            'password2': '1234x567'
        }

    def test_register_status(self):
        response = self.client.post('/users/register/', json.dumps(self.credentials), content_type="application/json")
        self.assertEqual(response.status_code, 200)

    def test_register_check_token(self):
        response = self.client.post('/users/register/', json.dumps(self.credentials), content_type="application/json")
        user = User.objects.get(username=self.credentials['username'])
        token = Token.objects.get(user=user)  # type: ignore
        result = json.loads(response.content)
        r = True if "items" in result else False
        self.assertTrue(r)
        self.assertEqual(result['token'], token.key)

    def test_register_status_error_username(self):
        credentials = {
            'username': 'aa',
            'email': 'newuser@mail.com',
            'password1': '1234x567',
            'password2': '1234x567'
        }
        response = self.client.post('/users/register/', json.dumps(credentials), content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_register_status_error_email(self):
        credentials = {
            'username': 'newuser',
            'email': '',
            'password1': '1234x567',
            'password2': '1234x567'
        }
        response = self.client.post('/users/register/', json.dumps(credentials), content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_register_status_error_pwd1(self):
        credentials = {
            'username': 'newuser',
            'email': 'newuser@mail.com',
            'password1': '',
            'password2': '1234x567'
        }
        response = self.client.post('/users/register/', json.dumps(credentials), content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_register_status_error_pwd2(self):
        credentials = {
            'username': 'newuser',
            'email': 'newuser@mail.com',
            'password1': '1234x567',
            'password2': ''
        }
        response = self.client.post('/users/register/', json.dumps(credentials), content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_register_status_error_pwd_diferent(self):
        credentials = {
            'username': 'newuser',
            'email': 'newuser@mail.com',
            'password1': '1233x567',
            'password2': '1234x567'
        }
        response = self.client.post('/users/register/', json.dumps(credentials), content_type="application/json")
        self.assertEqual(response.status_code, 401)
