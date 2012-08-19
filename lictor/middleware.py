from lictor.fake import make_fake


class FakeCollectMiddleware(object):

    def process_response(self, request, response):
        make_fake(request)
        return response
