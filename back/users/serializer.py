
def serialize_user(user):
    username = user.username
    email = user.email
    question = user.profile.question
    answer = user.profile.answer
    user_dict = {"username": username, "email": email, "question": question, "answer": answer}
    return user_dict
