from rest_framework.response import Response
from rest_framework import status
import json

from system.authenticate import validate_supabase_token


class AuthenticateMiddleWare:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        try:
            header_jwt: str = request.headers.get("Authorization")
            jwt: str = header_jwt.split()[1]  # Seleciona apenas o jwt

            header_token: str = request.headers.get("Token")
            token: str = header_token.split()[1]

            user = validate_supabase_token(jwt, token)

            if user:
                try:
                    request.owner =  user.id
                    response = self.get_response(request)
                    return response

                except json.JSONDecodeError:
                    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response(status.HTTP_401_UNAUTHORIZED)

        except KeyError:
            return Response(status.HTTP_400_BAD_REQUEST)
