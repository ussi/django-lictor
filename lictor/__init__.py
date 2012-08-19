import sys
import threading

from django.core.handlers.base import BaseHandler
from django.core.urlresolvers import reverse
from django.conf import settings

from lictor.replacer import replace_call
from lictor.collector import Tracer, Graph


def activate():
    """Activate lictor collector,
    for collect call stack and build graph.
    """
    @replace_call(BaseHandler.get_response)
    def get_response(func, instance, response):
        session = response.COOKIES.get(settings.LICTOR_SESSION_COOKIE_NAME)
        if not session or\
               response.META['PATH_INFO'].startswith(reverse('lictor-workspace')) or\
               response.META['PATH_INFO'].startswith(settings.STATIC_URL):
            return func(instance, response)

        # Collect trace
        tracer = Tracer()
        tracer.start()
        result = func(instance, response)
        tracer.stop()

        # Build graph in thread
        graph = Graph(tracer.frames)
        thread = threading.Thread(target=graph.build_and_save, args=[session])
        thread.daemon = True
        thread.start()

        return result
