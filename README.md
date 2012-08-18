django-lictor
=============


settings.py
--------

    MIDDLEWARE_CLASSES = (
        'lictor.middleware.Tracer',
    )

    INSTALLED_APPS = (
        'lictor',
    )

urls.py
-------

    urlpatterns = patterns('',
        url(r'^lictor/', include('lictor.urls')),
    )
