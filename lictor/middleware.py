from lictor.fake import make_fake
from django.conf import settings


class FakeCollectMiddleware(object):

    def process_response(self, request, response):
        make_fake(request)
        return response
