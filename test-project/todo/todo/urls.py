from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'todos.views.home', name='home'),
    url(r'^delete/$', 'todos.views.delete', name='delete'),
    url(r'^add/$', 'todos.views.add', name='add'),
    url(r'^lictor/', include('lictor.urls')),
)
