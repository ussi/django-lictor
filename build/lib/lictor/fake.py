import hashlib
import simplejson

from django.conf import settings

from lictor.models import Trace


def md5(s):
    return hashlib.md5(s).hexdigest()


def make_fake(request):
    session = request.COOKIES.get(settings.LICTOR_SESSION_COOKIE_NAME)
    dump = [
        {"i": md5("test_project.films.urls:12"), "t": "Url", "f": "test_project.films.urls", "l": 12, "n": r'^(?P<page>\d+)/$', "c": [md5("test_project.films.views:123")]},
        {"i": md5("test_project.films.views:123"), "t": "View", "f": "test_project.films.views", "l": 123, "n": "get", "c": [md5("test_project.films.forms:23")]},
        {"i": md5("test_project.films.models:42"), "t": "Model", "f": "test_project.films.models", "l": 42, "n": "__unicode__"},
        {"i": md5("test_project.films.forms:23"), "t": "Form", "f": "test_project.films.forms", "l": 23, "n": "init", "c": [md5("test_project.films.models:42")]},
        {"i": md5("test_project.films.forms:31"), "t": "Form", "f": "test_project.films.forms", "l": 31, "n": "clean", "c": [md5("test_project.films.models:42")]},
    ]
    Trace.objects.create(
        session=session,
        json=simplejson.dumps(dump))
