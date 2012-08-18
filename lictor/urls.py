from django.conf.urls import patterns, url
from lictor.views import LictorWorkspaceView

urlpatterns = patterns('',
    url(r'^$', LictorWorkspaceView.as_view(), name='lictor-workspace'),
)
