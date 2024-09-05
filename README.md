# Aplicación de Videollamada WebRTC

## Descripción

Esta es una aplicación web de videollamada basada en WebRTC que permite a los usuarios unirse a salas de chat y comunicarse mediante video y chat en tiempo real. La aplicación soporta múltiples usuarios en una única sala y permite la gestión de la cámara y el micrófono.

## Características

- Videollamadas en tiempo real utilizando WebRTC.
- Chat en tiempo real dentro de las salas.
- Crear nuevas salas y unirse a salas existentes.
- Gestión del estado de la cámara y el micrófono.
- Interfaz de usuario flexible y atractiva.

## Tecnologías Utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js con Express
- **WebRTC:** Para la comunicación en tiempo real
- **Socket.io:** Para la señalización en tiempo real

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3. Inicia el servidor:

    ```bash
    npm start
    ```

4. **Reenvío de puertos (opcional):**

   Para permitir que otros usuarios accedan a tu aplicación en una red pública, puedes utilizar [ngrok](https://ngrok.com/). Ngrok te permite crear un túnel seguro a tu aplicación local. Aquí está cómo configurarlo:

   - Instala ngrok si aún no lo has hecho:

     ```bash
     npm install -g ngrok
     ```

   - Inicia ngrok en el puerto en el que tu aplicación está escuchando (por defecto es el puerto 3000):

     ```bash
     ngrok http 3000
     ```

   - Ngrok proporcionará una URL pública que puedes compartir con otros para que accedan a tu aplicación.

5. Abre tu navegador y ve a la URL proporcionada por ngrok para ver la aplicación en acción.

## Uso

1. **Enviar mensajes en el chat:**
   - Escribe tu mensaje en el campo de entrada de chat y haz clic en "Enviar" o presiona Enter para enviar el mensaje.

2. **Gestionar cámara y micrófono:**
   - Usa los botones para encender/apagar la cámara y activar/silenciar el micrófono.

## Estructura del Proyecto

- `public/`: Carpeta que contiene los archivos estáticos (HTML, CSS, JS).
- `app.js`: Archivo principal del frontend que maneja la lógica de WebRTC y chat.
- `server.js`: Archivo del backend que maneja la señalización y gestión de salas.
- `package.json`: Archivo de configuración de npm que incluye las dependencias y scripts del proyecto.
