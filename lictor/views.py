from django.views.generic import TemplateView, DetailView
from django.conf import settings

from lictor.mixins import JsonResponseMixin


class LictorWorkspaceView(TemplateView):
    template_name = "lictor/workspace.html"

    def get_context_data(self, **kwargs):
        context = super(LictorWorkspaceView, self).get_context_data(**kwargs)
        context['LICTOR_SESSION_COOKIE_NAME'] = settings.LICTOR_SESSION_COOKIE_NAME
        return context


class LictorTraceLastId(JsonResponseMixin, DetailView):
    pass


class LictorTraceGetId(JsonResponseMixin, DetailView):
    pass
