from django.conf.urls import patterns, url
from .views import MainPageView

urlpatterns = patterns('',
    url(r'^$', MainPageView.as_view(), name="films"),
    url(r'^(?P<page>\d+)/$', MainPageView.as_view(), name="films-paged"),
)
