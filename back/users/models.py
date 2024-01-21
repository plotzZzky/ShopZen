from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=255)

    objects = models.Manager()

