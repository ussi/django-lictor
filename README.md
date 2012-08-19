django-lictor
=============


settings.py
--------

    INSTALLED_APPS = (
        'lictor',
    )

    LICTOR_SESSION_COOKIE_NAME = "lictor_session"

    import lictor
    lictor.activate()


urls.py
-------

    urlpatterns = patterns('',
        url(r'^lictor/', include('lictor.urls')),
    )

And migrate
-------

    ./manage.py migrate lictor