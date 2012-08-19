from django.conf.urls import patterns, url
from .views import FilmsView

urlpatterns = patterns('',
    url(r'^$', FilmsView.as_view(), name="films"),
    url(r'^(?P<page>\d+)/$', FilmsView.as_view(), name="films-paged"),
)
