# Tubo

Aplicación web sencilla para guardar contenido propio o autorizado de YouTube en MP3 o MP4. Detecta las calidades disponibles de cada video y funciona en escritorio y móvil.

## Requisitos

- Node.js 20 o superior
- npm 7 o superior

FFmpeg y yt-dlp se instalan con las dependencias del backend.

## Ejecutar en desarrollo

Abre dos terminales:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Visita `http://localhost:3000`.

## Producción

Compila el frontend con `npm run build`. Puedes cambiar la dirección del API mediante `VITE_API_URL`; por defecto, el frontend usa `/api`.

## Características

- MP3 a 128, 192 o 320 kbps
- MP4 hasta 1080p cuando el video lo permite
- Unión automática de audio y video en alta calidad
- Archivos temporales eliminados automáticamente después de 30 minutos
- Validación de enlaces, mensajes de error claros y diseño responsive

Respeta los derechos de autor y las condiciones de uso de la plataforma.

## Publicar gratis en Render

El archivo `render.yaml` permite desplegar frontend y backend como un único servicio:

1. Conecta este repositorio en Render.
2. Selecciona **New > Blueprint**.
3. Confirma el plan **Free** y crea el servicio.

El servicio gratuito se duerme después de 15 minutos sin tráfico. El primer acceso
después de ese tiempo puede tardar cerca de un minuto.
