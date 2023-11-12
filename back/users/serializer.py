
def serialize_user(user):
    username = user.username
    email = user.email
    image = user.profile.image
    user_dict = {"username": username, "email": email, "image": image.url}
    return user_dict
