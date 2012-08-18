import simplejson
# import pycallgraph
import hashlib

from lictor.models import Trace


def md5(s):
    return hashlib.md5(s).hexdigest()


class Tracer(object):
    """Stack tracer"""

    def __init__(self, session):
        self.session = session

    def is_enable(self):
        return bool(self.session)

    def start(self):
        # import pudb;pudb.set_trace()
        # pycallgraph.start_trace()
        pass

    def stop(self):
        # import pudb;pudb.set_trace()
        # pycallgraph.stop_trace()
        pass

    def dump_trace(self):
        dump = [
            {"i": md5("test_project.films.urls:12"), "t": "Url", "f": "test_project.films.urls", "l": 12, "n": r'^(?P<page>\d+)/$', "c": [md5("test_project.films.views:123")]},
            {"i": md5("test_project.films.views:123"), "t": "View", "f": "test_project.films.views", "l": 123, "n": "get", "c": [md5("test_project.films.forms:23")]},
            {"i": md5("test_project.films.models:42"), "t": "Model", "f": "test_project.films.models", "l": 42, "n": "__unicode__"},
            {"i": md5("test_project.films.forms:23"), "t": "Form", "f": "test_project.films.forms", "l": 23, "n": "init", "c": [md5("test_project.films.models:42")]},
            {"i": md5("test_project.films.forms:31"), "t": "Form", "f": "test_project.films.forms", "l": 31, "n": "clean", "c": [md5("test_project.films.models:42")]},
        ]
        Trace.objects.create(
            session=self.session,
            json=simplejson.dumps(dump))
