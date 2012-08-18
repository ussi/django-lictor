from lictor.collector import Tracer
from django.conf import settings


class CollectMiddleware(object):

    def process_request(self, request):
        self.tracer = Tracer(session=request.COOKIES.get(settings.LICTOR_SESSION_COOKIE_NAME))
        if self.tracer.is_enable():
            self.tracer.start()
        return None

    def process_response(self, request, response):
        if hasattr(self, 'tracer') and self.tracer.is_enable():
            self.tracer.stop()
            self.tracer.dump_trace()
        return response
