from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta, datetime


def create_new_token(user):
    try:
        token = Token.objects.get(user=user)  # type: ignore
        token.delete()
    except ObjectDoesNotExist:
        pass

    new_token = Token.objects.create(user=user)  # type: ignore
    new_token.expires = datetime.now() + timedelta(minutes=10)
    new_token.save()
    return new_token
