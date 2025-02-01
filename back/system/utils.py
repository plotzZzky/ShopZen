from better_profanity import profanity


def check_profanity(request):
    for key, value in request.data.items():
        try:
            if value:
                str_value: str = str(value)
                if profanity.contains_profanity(str_value):
                    return True

        except (ValueError, TypeError):
            pass
