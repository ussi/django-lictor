import simplejson
from lictor.models import Trace


class Tracer(object):
    """Stack tracer"""

    def __init__(self, session):
        self.session = session

    def is_enable(self):
        return bool(self.session)

    def start(self):
        pass

    def stop(self):
        pass

    def dump_trace(self):
        dump = {'test': True}
        Trace.objects.create(
            session=self.session,
            json=simplejson.dumps(dump))
