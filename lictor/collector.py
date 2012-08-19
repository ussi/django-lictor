import os
import sys
import simplejson
from hashlib import md5 as hasher

from django.conf import settings
from django.utils.importlib import import_module
from django.utils.datastructures import SortedDict

from lictor.models import Trace


class Tracer(object):
    frames = []

    def __init__(self):
        self.lictor_path = os.path.dirname(__file__)

    def start(self):
        sys.setprofile(self.tracer)

    def stop(self):
        sys.setprofile(None)

    def tracer(self, frame, event, arg):
        if self.lictor_path not in frame.f_code.co_filename:
            self.frames.append((frame, event, arg, ))


class Graph(object):
    frames = []
    apps = []
    graph = SortedDict()

    def __init__(self, frames):
        self.frames = frames
        for app in settings.INSTALLED_APPS + ('django', ):
            self.apps.append(import_module(app).__file__.rsplit('/', 1)[0])
        self.apps.remove(os.path.dirname(__file__))  # remove lictor

    def add(self, iframe, event):
        id_ = iframe.get_id()
        parent_iframe = self.find_django_parent_frame(iframe.parent)
        self.graph[id_] = {
            "id": id_,
            "type": iframe.get_django_type(),
            "file": iframe.get_filename(),
            "line": iframe.get_lineno(),
            "name": iframe.get_django_name(),
            "pid": parent_iframe and parent_iframe.get_id()
        }

    def find_django_parent_frame(self, iframe):
        while iframe:
            if iframe.get_id() in self.graph.keys():
                return iframe
            iframe = iframe.parent

    def is_available_frame(self, path=""):
        for app_path in self.apps:
            if app_path in path:
                return True
        return False

    def build_and_save(self, session):
        for frame, event, arg in self.frames:
            if self.is_available_frame(path=frame.f_code.co_filename):
                iframe = FrameInspector(frame)
                self.add(iframe, event)
        for g in self.graph.values():
            print g['file']
            print
        # Trace.objects.create(
        #     session=session,
        #     json=simplejson.dumps(self.graph.values()))


class FrameInspector(object):
    django_name = "FakeName"
    django_type = "FakeType"

    def __init__(self, frame):
        assert frame
        self.frame = frame
        self.inspect()

    def inspect(self):
        if "models/manager" in self.frame.f_code.co_filename and "__get__" in self.frame.f_code.co_name:
            # models.Manager
            self.django_name = self.frame.f_locals['self'].manager.model
            self.django_type = "models.Manager"

    def get_id(self):
        return hasher(self.get_filename() + str(self.get_lineno())).hexdigest()

    def get_filename(self):
        return self.frame.f_code.co_filename

    def get_lineno(self):
        return self.frame.f_code.co_firstlineno

    def get_django_type(self):
        return self.django_type

    def get_django_name(self):
        return self.django_name

    @property
    def parent(self):
        try:
            return FrameInspector(self.frame.f_back)
        except:
            return None
