from django.db import models


class Film(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='films/thumbnails', null=True)

    def __unicode__(self):
        return self.title
