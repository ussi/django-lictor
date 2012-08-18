from django.conf.urls import patterns, url
from lictor.views import LictorWorkspaceView, LictorTraceLast, LictorTraceGet

urlpatterns = patterns('',
    url(r'^$', LictorWorkspaceView.as_view(), name='lictor-workspace'),
    url(r'^last/$', LictorTraceLast.as_view(), name='lictor-trace-last'),
    url(r'^get/$', LictorTraceGet.as_view(), name='lictor-trace-get'),
)
