from django.views.generic import ListView
from django.shortcuts import redirect

from .models import Film
from .forms import AddFilmForm


class FilmsView(ListView):
    queryset = Film.objects.order_by('-pk')
    paginate_by = 10
    form_class = AddFilmForm

    def get_context_data(self, **kwargs):
        context = super(FilmsView, self).get_context_data(**kwargs)
        context['form'] = self.form_class
        return context

    def dispatch(self, request, *a, **kw):
        form = self.form_class(data=request.POST or None)
        if form.is_valid():
            form.save()
            return redirect(request.META.get('PATH_INFO'))
        return super(FilmsView, self).dispatch(request, *a, **kw)
