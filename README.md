# django-lictor

**Reusable application for visualizing your Django projects via stack trace.**

Please see the test_project for a working example. 

![django-lictor]()

## Setup

``` sh
$ pip install -e git://github.com/mjhea0/django-lictor.git#egg=django-lictor
```

## Add to settings.py:

```python
INSTALLED_APPS = (
    'lictor',
    'south'
)

LICTOR_SESSION_COOKIE_NAME = "lictor_session"

import lictor
lictor.activate()
```

> Make sure to update the cookie name

## Add to urls.py:

```python
urlpatterns = patterns('',
    url(r'^lictor/', include('lictor.urls')),
)
```

## South migrate and runserver:

```python
$ python manage.py syncdb
$ python manage.py migrate lictor
$ python setup.py install # from lictor directory
$ python manage.py runserver
```

Go to [http://localhost:8000/lictor](http://localhost:8000/lictor) to access the lictor portal.