from django import forms

from .models import Film


class AddFilmForm(forms.ModelForm):
    class Meta:
        model = Film
        fields = (
            'title',
        )
