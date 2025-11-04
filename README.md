# App Clima — Neumorfismo Dark/Light

**Demo:** https://yvl0420.github.io/app_clima/

## Descripción
App Clima es una pequeña aplicación web para consultar el **clima actual** y la **previsión a 5 días**.  
Interfaz diseñada con estética **neumorfismo** (modo oscuro por defecto + opción claro/oscuro), historial paginado en escritorio y slider en móvil, iconografía outline y diseño responsive.

## ¿Qué es *neumorfismo* y por qué lo usamos?
El neumorfismo es una tendencia visual que combina colores suaves, sombras sutiles y relieves para crear tarjetas y controles que parecen emerger del fondo (efecto “soft 3D”).  
Se usa aquí porque:
- Aporta una apariencia moderna y elegante.
- Resalta componentes (cards, botones) sin perder usabilidad.
- Funciona bien con el modo oscuro y los iconos outline elegidos para esta app.

## Tecnologías
- HTML5, CSS3 (responsive, variables CSS)
- JavaScript (fetch hacia OpenWeather)
- API: OpenWeather (datos de clima)

## Probar local (rápido)
### Opción A — Rápida (sin servidor):
1. Clona el repo.
2. Abre `index.html` en tu navegador (doble clic) o usa Live Server en VSCode.

> **Nota:** si cargas el `index.html` directamente y quieres usar tu key, edita `app.js` localmente y reemplaza la constante placeholder `const API_KEY = "TU_API_KEY_AQUI";` por tu key **solo en local**.

### Opción B — Recomendado (evitar subir la key)
1. Clona el repo.
2. Crea un archivo `.env.local` en la raíz con:
VITE_CLIMA_KEY=TU_API_KEY
3. Usa un entorno local (Vite) que soporte `import.meta.env` o monta un pequeño servidor que entregue la key desde variables de entorno. (Para proyectos estáticos simples se puede usar un pequeño proxy si se quiere ocultar la key).

## Seguridad
**No subas** tu API key al repositorio. Si publicas en GitHub Pages, limita la key por referer (si OpenWeather lo permite) o usa un backend/proxy para ocultarla.

## Deploy
La app está desplegada en GitHub Pages:  
https://yvl0420.github.io/app_clima/

## Autor
Yolanda — [github.com/yvl0420](https://github.com/yvl0420)
