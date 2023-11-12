def valid_user(password, pwd, username, email):
    if not validate_password(password, pwd):
        return False
    if not validate_username(username):
        return False
    if not validate_email(email):
        return False
    return True


def validate_password(password, pwd):
    return False if password != pwd or len(password) < 5 else True


def validate_username(username):
    return False if len(username) < 4 else True


def validate_email(email):
    if '@' not in email or 'mail.com' not in email:
        return False
    else:
        return True


