# Sonidos Profundos de Colombia — Sitio Web

Sitio web institucional para la agrupación de música tradicional del Pacífico colombiano **Sonidos Profundos de Colombia**.

## Estructura

```
├── index.html
├── rider-tecnico.html
├── css/
│   ├── styles.css
│   └── rider.css
├── js/
│   └── script.js
└── images/
```

## Páginas

- **index.html** — sitio principal: historia, espectáculo, integrantes, reconocimientos, galería y contacto.
- **rider-tecnico.html** — ficha técnica completa para producción de eventos (tarima, sonido, iluminación, stage plot, input list, electricidad, catering, transporte). Enlazada desde el footer y la sección de contacto del sitio principal. Incluye botón de impresión/PDF.

## Uso local

Abre `index.html` en cualquier navegador, o sirve la carpeta con un servidor local:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Formulario de contacto

El formulario está preparado para [Web3Forms](https://web3forms.com). Reemplaza `YOUR_ACCESS_KEY_HERE` en `index.html` por tu access key real antes de publicar.

## WhatsApp

El sitio incluye un botón flotante de WhatsApp (visible en todas las páginas) y un botón directo en la sección de Contacto. Ambos usan el número del manager (+57 316 620 0394) con un mensaje predefinido.

Para cambiar el número o el mensaje, busca `wa.me/573166200394` en `index.html` y `rider-tecnico.html` (aparece 3 veces en total) y reemplaza:
- El número (formato: código de país + número, sin espacios ni símbolos)
- El texto después de `?text=` (debe estar codificado como URL — espacios como `%20`)

## Publicar con GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En "Source", selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda; tu sitio quedará publicado en `https://<usuario>.github.io/<repositorio>/`.
