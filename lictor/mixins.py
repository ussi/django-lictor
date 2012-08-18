import datetime

from django.http import HttpResponse
from django.core.serializers import serialize
from django.utils.simplejson import loads, JSONEncoder
from django.db.models.query import QuerySet, ValuesQuerySet


class DjangoJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return unicode(obj)
        if isinstance(obj, ValuesQuerySet):
            return list(obj)
        if isinstance(obj, QuerySet):
            return loads(serialize('json', obj))
        return JSONEncoder.default(self, obj)


class JsonResponseMixin(object):
    def render_to_response(self, context):
        content = DjangoJSONEncoder().encode(context)
        return HttpResponse(content, content_type='application/json')
