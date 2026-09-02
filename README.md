# Porcionamientos Caujaral

Registro y análisis de porcionamiento y merma de carnes del Club Lagos de Caujaral.

- Página autónoma: todo el HTML/CSS/JS vive en `Porcionamientos Caujaral.html`.
- `server.js` solo la sirve (Node, sin dependencias externas) — no hay base de datos en el servidor.
- Los datos que registra cada persona (lotes, catálogo editado) quedan guardados en el
  navegador de su propio dispositivo (`localStorage`), no se sincronizan entre equipos.
- `/salud` responde un JSON simple para confirmar que el servicio está arriba.

## Publicar un cambio

Editar `Porcionamientos Caujaral.html`, luego:

```
git add -A
git commit -m "..."
git push
```

Railway redespliega solo (auto-deploy activado) y el link no cambia.
