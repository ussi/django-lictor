from django.views.generic import TemplateView, View
from django.conf import settings

from lictor.mixins import JsonResponseMixin
from lictor.models import Trace


class LictorWorkspaceView(TemplateView):
    template_name = "lictor/workspace.html"

    def get_context_data(self, **kwargs):
        context = super(LictorWorkspaceView, self).get_context_data(**kwargs)
        context['LICTOR_SESSION_COOKIE_NAME'] = settings.LICTOR_SESSION_COOKIE_NAME
        return context


class LictorTraceLast(JsonResponseMixin, View):
    model = Trace

    def dispatch(self, request):
        context = {}
        context['new'] = [
            trace[0] for trace in self.model.objects\
                .filter(session=request.GET.get('sid'), pk__gt=request.GET.get('last'))\
                .order_by('pk').values_list('pk')]
        trace = self.model.objects.filter(pk=context['new'][-1]).values()[0]
        context['json'] = trace
        return self.render_to_response(context)


class LictorTraceGet(JsonResponseMixin, View):
    model = Trace

    def dispatch(self, request):
        context = {}
        trace = self.model.objects.filter(pk=request.GET.get('id')).values()[0]
        context[trace['id']] = trace
        return self.render_to_response(context)
