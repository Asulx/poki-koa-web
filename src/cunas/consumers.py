import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Cuando el cliente React intente conectarse, lo unimos a un "grupo" de transmisión
        self.grupo_cunas = 'monitoreo_cunas'

        await self.channel_layer.group_add(
            self.grupo_cunas,
            self.channel_name
        )
        
        # Aceptamos la conexión del frontend
        await self.accept()
        print("Frontend conectado al WebSocket de Cunas exitosamente.")

    async def disconnect(self, close_code):
        # Si el usuario cierra el navegador o cambia de página en React, lo sacamos del grupo
        await self.channel_layer.group_discard(
            self.grupo_cunas,
            self.channel_name
        )
        print("Frontend desconectado del WebSocket.")

    # Esta función será llamada cada vez que una cuna cambie su estado en la base de datos
    async def cot_update(self, event):
        datos_cuna = event['message']

        # Empujamos la actualización al frontend a través del túnel en formato JSON
        await self.send(text_data=json.dumps({
            'type': 'actualizacion_cuna',
            'data': datos_cuna
        }))