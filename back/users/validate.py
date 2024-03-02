from django.contrib.auth.hashers import make_password
import re


def valid_user(password, pwd, username, email):
    return (
        validate_password(password, pwd) and
        validate_username(username) and
        validate_email(email)
    )


def validate_password(password, pwd):
    return password == pwd and len(password) >= 8 and find_char(password)


# Verifica se tem letras e digitos na senha
def find_char(text):
    char = any(char.isalpha() for char in text)
    digit = any(char.isdigit() for char in text)
    return char and digit


def validate_username(username):
    try:
        return False if len(username) < 4 else True
    except TypeError:
        return False


def validate_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[com]', email) is not None


def validate_question(question):
    if isinstance(question, str) and len(question) > 3:
        return True


def validate_answer(answer):
    if answer is not None and len(answer) > 3:
        return make_password(answer)
