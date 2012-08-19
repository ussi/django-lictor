from django.views.generic import ListView
from .models import Film


class MainPageView(ListView):
    queryset = Film.objects.order_by('-pk')
    paginate_by = 10
