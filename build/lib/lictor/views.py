import simplejson
from django.views.generic import TemplateView, View
from django.conf import settings

from lictor.mixins import JsonResponseMixin
from lictor.models import Trace

def getAppName(app):
    return app.split(".")[-1].title()

class LictorWorkspaceView(TemplateView):
    template_name = "lictor/workspace.html"

    def get_context_data(self, **kwargs):
        context = super(LictorWorkspaceView, self).get_context_data(**kwargs)
        context['LICTOR_SESSION_COOKIE_NAME'] = settings.LICTOR_SESSION_COOKIE_NAME
        apps = list(settings.INSTALLED_APPS)
        apps.remove('lictor')
        context['available_apps'] = [(app, getAppName(app)) for app in  apps]
        return context


class LictorTraceLast(JsonResponseMixin, View):
    model = Trace

    def dispatch(self, request):
        context = {}
        context['new'] = [
            [trace['pk'], trace['created']] for trace in self.model.objects\
                .filter(session=request.REQUEST.get('sid'), pk__gt=request.REQUEST.get('last'))\
                .order_by('pk').values('pk', 'created')]
        return self.render_to_response(context)


class LictorTraceGet(JsonResponseMixin, View):
    model = Trace

    def dispatch(self, request):
        context = {}
        trace = self.model.objects.filter(pk=request.REQUEST.get('id')).values()[0]
        trace['json'] = simplejson.loads(trace['json'])
        context[trace['id']] = trace
        return self.render_to_response(context)
