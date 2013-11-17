from django.db import models

# === Models for Todos app ===


class ListItem(models.Model):
    """
    The ListItem class defines the main storage point for todos.
    Each todo has two fields:
    text - stores the text of the todo
    is_visible - used to control if the todo is displayed on screen
    """

    text = models.CharField(max_length=300)
    is_visible = models.BooleanField()

