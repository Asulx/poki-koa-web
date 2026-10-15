from django.urls import re_path
from . import consumers

# Aquí definimos la URL a la que se conectará tu frontend en React
# re_path usa expresiones regulares. La 'ws/' al principio indica que es WebSocket.
websocket_urlpatterns = [
    re_path(r'ws/cots/$', consumers.CotConsumer.as_asgi()),
]