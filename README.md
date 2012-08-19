django-lictor
=============

**Reusable application for visualization your Django-projects via stack trace.**

You need to install it (see below), then the interface will be available by address http://example.org/lictor/.
During the execution of your project will collect traceback and drawn in the interface "django-lictor".

    pip install -e git://github.com/ussi/django-lictor.git#egg=django-lictor
    
The demo project: http://lictor.tetronix.org/ and http://lictor.tetronix.org/lictor/

Add to settings.py:
--------

    INSTALLED_APPS = (
        'lictor',
    )

    LICTOR_SESSION_COOKIE_NAME = "lictor_session"

    import lictor
    lictor.activate()


Add to urls.py:
-------

    urlpatterns = patterns('',
        url(r'^lictor/', include('lictor.urls')),
    )

South migrate and runserver:
-------

    ./manage.py migrate lictor
    ./manage.py runserver
