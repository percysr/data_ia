# RetailPerú — Analizador de Datos con IA
### Transformación Digital · Postgrado Ejecutivo UPC · Sesión 4

---

## ¿Qué es esto?

Una aplicación web que permite a ejecutivos analizar los datos de RetailPerú S.A. 
haciendo preguntas en lenguaje natural. La IA responde con insights estratégicos 
y estimaciones de impacto en soles.

## Despliegue en Vercel (3 pasos, 5 minutos)

### Paso 1 — Subir a GitHub
1. Crea un repositorio nuevo en github.com (puede ser privado)
2. Sube estos archivos al repositorio

### Paso 2 — Importar a Vercel
1. Ve a vercel.com → "Add New Project"
2. Importa el repositorio de GitHub
3. Vercel detecta automáticamente que es Next.js — no cambies nada
4. Haz clic en "Deploy" (fallará en el primer intento — eso es normal)

### Paso 3 — Agregar la API Key
1. En Vercel → tu proyecto → Settings → Environment Variables
2. Agrega: Name = `ANTHROPIC_API_KEY` / Value = tu key de Anthropic
3. Haz clic en "Redeploy"

✅ Tu URL estará lista en: https://retailperu-analizador-ia.vercel.app

---

## Cómo compartir con estudiantes

Copia la URL y pégala en el chat de la clase virtual (Zoom/Teams).
No requiere cuenta ni instalación — abre en cualquier navegador.

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Tu API key de Anthropic (console.anthropic.com) |

---

Desarrollado para el curso de Transformación Digital · Percy Sunohara R.
