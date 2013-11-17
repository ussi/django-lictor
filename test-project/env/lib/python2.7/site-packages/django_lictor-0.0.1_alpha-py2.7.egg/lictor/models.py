from django.db import models


class Trace(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    session = models.BigIntegerField()
    json = models.TextField()
