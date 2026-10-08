'use strict';
/**
 * Sirve el aplicativo de Porcionamientos - Analisis de carniceria del Club
 * Lagos de Caujaral. Es una pagina autonoma (todo el HTML/CSS/JS en un solo
 * archivo): aqui solo se entrega, no hay base de datos ni consultas vivas.
 * Los datos que registra cada usuario quedan en el navegador de su propio
 * dispositivo (localStorage), no en este servidor.
 *
 * Para actualizar lo que ve la cocina: editar el HTML, commit y push.
 * Railway redespliega solo y el link no cambia.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PUERTO = Number(process.env.PORT || 3000);
const ARCHIVO = path.join(__dirname, 'Porcionamientos Caujaral.html');

// Imagenes propias de la pagina (el logo del Club). Se sirven tal cual, sin
// pasar por un file server generico, para no abrir el directorio completo.
const IMAGENES = {
  '/logo-caujaral.png': path.join(__dirname, 'logo-caujaral.png'),
  '/logo-caujaral-completo.png': path.join(__dirname, 'logo-caujaral-completo.png'),
};

let PAGINA = '';
let PAGINA_GZ = null;
let ARRANQUE = new Date();
const IMAGENES_CARGADAS = {};

function cargar() {
  PAGINA = fs.readFileSync(ARCHIVO, 'utf8');
  PAGINA_GZ = zlib.gzipSync(Buffer.from(PAGINA, 'utf8'), { level: 9 });
  for (const [ruta, archivo] of Object.entries(IMAGENES)) {
    try {
      IMAGENES_CARGADAS[ruta] = fs.readFileSync(archivo);
    } catch (e) {
      console.error('No se pudo leer la imagen ' + archivo + ':', e.message);
    }
  }
}

const servidor = http.createServer((req, res) => {
  const ruta = (req.url || '/').split('?')[0];

  if (ruta === '/salud') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ estado: 'ok', arranque: ARRANQUE.toISOString() }, null, 2));
    return;
  }

  if (ruta === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('User-agent: *\nDisallow:\n');
    return;
  }

  if (IMAGENES_CARGADAS[ruta]) {
    res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
    res.end(IMAGENES_CARGADAS[ruta]);
    return;
  }

  if (ruta === '/' || ruta === '/index.html') {
    const aceptaGzip = String(req.headers['accept-encoding'] || '').includes('gzip');
    const cabeceras = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    };
    if (aceptaGzip && PAGINA_GZ) {
      cabeceras['Content-Encoding'] = 'gzip';
      cabeceras['Content-Length'] = PAGINA_GZ.length;
      res.writeHead(200, cabeceras);
      res.end(PAGINA_GZ);
    } else {
      res.writeHead(200, cabeceras);
      res.end(PAGINA);
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Aqui no hay nada. El aplicativo esta en /');
});

try {
  cargar();
} catch (e) {
  console.error('No se pudo leer "Porcionamientos Caujaral.html":', e.message);
  process.exit(1);
}

servidor.listen(PUERTO, () => {
  console.log('Porcionamientos Caujaral escuchando en el puerto ' + PUERTO);
});
