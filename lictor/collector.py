import os
import sys
import simplejson
from hashlib import md5 as hasher

from django.conf import settings

from django.utils.importlib import import_module
from django.utils.datastructures import SortedDict


class Tracer(object):
    frames = []

    def __init__(self):
        self.lictor_path = os.path.dirname(__file__)

    def start(self):
        """Setup the tracer"""
        sys.setprofile(self.tracer)

    def stop(self):
        sys.setprofile(None)

    def tracer(self, frame, event, arg):
        """The call handler, which receive a frame and save it to self.frames"""
        if self.lictor_path not in frame.f_code.co_filename:
            # Exclude lictor app
            self.frames.append((frame, event, arg, ))


class Graph(object):
    frames = []
    available_apps = []
    graph = SortedDict()

    def __init__(self, frames, session, available_apps):
        self.frames = frames
        self.session = session

        available_apps = available_apps or settings.INSTALLED_APPS
        for app in available_apps + ('django', ):
            self.available_apps.append(import_module(app).__file__.rsplit('/', 1)[0])
        try:
            self.available_apps.remove(os.path.dirname(__file__))  # Remove lictor
        except ValueError:
            pass

    def add(self, iframe):
        """Add iframe to graph"""
        iframe_id = iframe.get_id()
        parent_iframe = self.find_django_parent_frame(iframe.parent)
        self.graph[iframe_id] = {
            "id": iframe_id,
            "type": iframe.get_django_type(),
            "file": iframe.get_filename(),
            "line": iframe.get_lineno(),
            "module": iframe.get_module(),
            "name": iframe.get_name(),
            "pid": parent_iframe and parent_iframe.get_id()
        }

    def find_django_parent_frame(self, iframe):
        """Binding frame-to-parent, excluding unnecessary frames"""
        while iframe:
            if iframe.get_id() in self.graph.keys() and iframe.get_django_type():
                return iframe
            iframe = iframe.parent

    def is_available_frame(self, path=""):
        """Check frame.f_code.co_filename in self.available_apps"""
        for app_path in self.available_apps:
            if app_path in path:
                return True
        return False

    def build_and_save(self):
        """Build the graph of call stack and save result to Trace model"""
        for frame, event, arg in self.frames:
            if self.is_available_frame(frame.f_code.co_filename):
                iframe = FrameInspector(frame)
                if iframe and iframe.get_name():
                    self.add(iframe)

        from lictor.models import Trace
        Trace.objects.create(
            session=self.session,
            json=simplejson.dumps(self.graph.values()))


class FrameInspector(object):
    """Extractor useful information from frame"""
    django_type = "FakeType"

    def __init__(self, frame):
        assert frame
        self.frame = frame
        self.module, self.name, self.django_type = self.inspect()

    def inspect(self):
        """Extract additional infromation from frame
        Example:
        * django type (Model, Manager, View, Url, Form, etc)
        * django name ("films.models.Film", "films.form.SomeForm", "urlpattern(^(?P<page>\d+)/$)")
        """
        from django.db.models.query import QuerySet
        from django.forms import ModelForm, Form

        filename = self.get_filename()

        if "django/core/urlresolvers" in filename:
            # urlresolver
            # from django.core.urlresolvers import ResolverMatch
            # instance = self.frame.f_locals.get('self')
            # if instance.__class__ is ResolverMatch:
            #     self.frame.f_locals.get('func')
            #     return "Url"
            return "", self.frame.f_locals.get('path'), "Url"

        if "django/views" in filename:
            instance = self.frame.f_locals.get('self')
            if instance:
                return instance.__class__.__module__, instance.__class__.__name__, "View"

        if "django/db/models/query.py" in filename:
            instance = self.frame.f_locals.get('self')
            if isinstance(instance, (QuerySet, )):
                return instance.model.__module__, instance.model.__name__, "Model"

        if "django/forms" in filename:
            type_of_instance = type(self.frame.f_locals.get('self'))
            if issubclass(type_of_instance, ModelForm):
                return type_of_instance.__module__, type_of_instance.__name__, "ModelForm"
            if issubclass(type_of_instance, Form):
                return type_of_instance.__module__, type_of_instance.__name__, "Form"
        return "", "", ""

    def get_id(self):
        """Return identificator of frame, for binging frame stack"""
        return hasher(self.get_filename() + str(self.get_lineno())).hexdigest()

    def get_filename(self):
        return self.frame.f_code.co_filename

    def get_lineno(self):
        return self.frame.f_code.co_firstlineno

    def get_django_type(self):
        return self.django_type

    def get_module(self):
        return self.module

    def get_name(self):
        return self.name

    @property
    def parent(self):
        """Return a parent of frame"""
        try:
            return FrameInspector(self.frame.f_back)
        except:
            return None
