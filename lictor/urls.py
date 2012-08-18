from django.conf.urls import patterns, url
from lictor.views import LictorWorkspaceView, LictorTraceLastId, LictorTraceGetId

urlpatterns = patterns('',
    url(r'^$', LictorWorkspaceView.as_view(), name='lictor-workspace'),
    url(r'^last/$', LictorTraceLastId.as_view(), name='lictor-trace-last-id'),
    url(r'^get/(?P<id>\d+)/$', LictorTraceGetId.as_view(), name='lictor-trace-get-id'),
)
