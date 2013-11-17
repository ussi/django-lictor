"""
All the views for our todos applicaiton
Currently we support the following 3 views:

1. **Home** - The main view for Todos (jump to section in [[views.py#home]] )
2. **Delete** - called to delete a todo ( jump to section in [[views.py#delete]] )
3. **Add** - called to add a new todo (jump to section in [[views.py#add]])
"""

from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext

# defined in [[models.py]]
from todos.models import ListItem

# === home ===
def home(request):
	items = ListItem.objects.filter(is_visible=True)
	return render_to_response('home.html', {'items': items}, context_instance = RequestContext(request))

# === delete ===
def delete(request):
	if request.method == 'POST' and request.POST['id'] is not None:
		item = ListItem.objects.get(id=request.POST['id'])
		item.is_visible = False
		item.save()
	return render_to_response('home.html', {'items': ListItem.objects.filter(is_visible=True)}, context_instance = RequestContext(request))

# === add ===
def add(request):
	if request.method == 'POST' and request.POST['text'] is not None:
		ListItem.objects.create(text=request.POST['text'], is_visible=True)
	return render_to_response('home.html', {'items': ListItem.objects.filter(is_visible=True)}, context_instance = RequestContext(request))# Create your views here.
