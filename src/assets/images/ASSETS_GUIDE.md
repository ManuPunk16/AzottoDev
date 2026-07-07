# Guía de Assets del Portfolio (Imágenes y Logos)

Esta guía explica la estructura de directorios optimizada para organizar imágenes, capturas y logos dentro del portafolio **AzottoDev**, asegurando consistencia y facilidad de mantenimiento.

---

## 📁 Estructura de Directorios

Todos los recursos visuales deben colocarse dentro de la carpeta global `src/assets/images/` organizada bajo las siguientes subcarpetas:

```text
src/assets/images/
├── brands/                   # Recursos de marca personal (Avatares, firmas, banners)
├── articles/                 # Portadas e ilustraciones para artículos del Blog
└── projects/                 # Capturas e imágenes de proyectos divididos por nicho
    ├── logos/                # Logos individuales de cada proyecto
    ├── gov/                  # Proyectos gubernamentales e institucionales
    ├── saas/                 # Software as a Service y productos digitales comerciales
    ├── fintech/              # Proyectos del sector financiero y blockchain
    └── edu/                  # Proyectos del sector educativo, cursos y e-learning
```

---

## 🏛️ Categorización por Nicho y Contenido

### 1. `projects/gov/` (Gubernamental)
*   **Qué poner aquí**: Capturas de pantalla de portales ciudadanos, dashboards de trámites públicos, sistemas de transparencia u optimización administrativa.
*   **Estética recomendada**: Capturas claras y limpias que muestren accesibilidad, legibilidad de datos y diseño enfocado en la ciudadanía.

### 2. `projects/saas/` (SaaS / Comercial)
*   **Qué poner aquí**: Capturas de plataformas multi-inquilino (multi-tenant), interfaces de usuario dinámicas, flujos de suscripción, integraciones de API o consolas de administración comercial.
*   **Estética recomendada**: Capturas estilizadas (pueden tener fondos en gradientes sutiles o mockups de navegador minimalistas).

### 3. `projects/fintech/` (FinTech)
*   **Qué poner aquí**: Gráficos de balances, consolas de procesamiento de pagos, simuladores de crédito, carteras digitales o portales Web3.
*   **Estética recomendada**: Énfasis en la claridad visual de datos complejos y transacciones estructuradas.

### 4. `projects/edu/` (E-Learning / Educación)
*   **Qué poner aquí**: Capturas de plataformas de aprendizaje en línea (LMS), visualizadores de lecciones de video, paneles de progreso de estudiantes o juegos educativos interactivos.
*   **Estética recomendada**: Interfaces interactivas y amigables con alto grado de legibilidad.

### 5. `projects/logos/` (Logos de Proyectos)
*   **Qué poner aquí**: El logo isotipo/imagotipo de cada proyecto individual para ser mostrado en las tarjetas del portfolio.
*   **Estética recomendada**: Preferentemente archivos **SVG** con fondo transparente, o archivos **PNG** optimizados de relación cuadrada.

---

## 📏 Formatos y Buenas Prácticas de Optimización

Para mantener la velocidad de carga ultra rápida del portafolio (cumpliendo con Core Web Vitals), sigue estas reglas:

| Tipo de Recurso | Formato Recomendado | Dimensiones Sugeridas | Peso Máximo |
| :--- | :--- | :--- | :--- |
| **Logos e Iconos** | `.svg` (vectorial) | Ajuste flexible (relación 1:1) | < 15 KB |
| **Capturas Hero / Portadas** | `.webp` (rasterizado) | `1200 x 630 px` (relación 1.91:1) | < 120 KB |
| **Capturas de Detalle** | `.webp` o `.png` | `800 x 600 px` o similar | < 80 KB |
| **Avatar / Perfil** | `.webp` | `400 x 400 px` (relación 1:1) | < 45 KB |

### 🛠️ Herramientas de optimización sugeridas:
- **SVGO / SVGOMG**: Para limpiar código innecesario de archivos SVG.
- **TinyPNG / Squoosh**: Para comprimir y convertir imágenes PNG/JPG a `.webp`.

---

## ✏️ Convención de Nombres (Kebab-Case)

Nombra siempre tus archivos en minúsculas y separa las palabras con guiones medios.

- **Bien**: `src/assets/images/projects/logos/mi-proyecto-saas.svg`
- **Bien**: `src/assets/images/projects/gov/portal-transparencia-hero.webp`
- **Mal**: `src/assets/images/projects/gov/Hero_Dashboard_Transparencia(1).png`
- **Mal**: `src/assets/images/brands/FOTO_PERFIL.JPG`
