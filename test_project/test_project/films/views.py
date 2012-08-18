from django.views.generic import ListView
from .models import Film


class MainPageView(ListView):
    paginate_by = 10
    queryset = Film.objects.order_by('-pk')

    # def get_context_data(self, **kwargs):
    #     context = super(MainPageView, self).get_context_data(**kwargs)
    #     return context
