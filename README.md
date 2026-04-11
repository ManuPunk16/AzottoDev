# 🌟 AzottoDev — Portfolio Personal de Luis Hernández

> Vitrina técnica, generador de confianza y máquina de leads. Desarrollado con Angular 21, TypeScript y Tailwind CSS 4.x, desplegado en Vercel.

[![Demo Live](https://img.shields.io/badge/Demo-azotodev.com-success)](https://azotodev.com)
[![Angular](https://img.shields.io/badge/Angular-21.x-red)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

## 🎨 Características

- ⚡ **Angular 21** — Standalone Components, Signals, `@if/@for/@switch`, `inject()`
- 🎭 **Tema dual** (claro/oscuro) con persistencia en `localStorage`
- 📱 **100% Mobile-First** con Tailwind CSS 4.x y CSS Variables
- 🔍 **SEO 100/100** — meta tags dinámicos, Schema.org, Open Graph, Twitter Cards
- 📊 **Performance 95+** en Lighthouse + Core Web Vitals verdes
- 🖼️ **Galería de proyectos** con detalle individual por ruta
- 📚 **Blog técnico** con artículos en Markdown y syntax highlighting (Prism.js)
- 🎯 **TypeScript strict** sin `any`
- 🚀 **PWA** completa con Angular Service Worker
- 📈 **Analytics** con Vercel Analytics (sin Firebase)
- ♿ **Accesibilidad WCAG 2.1 AA**

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 21.x (Standalone, Signals) |
| Lenguaje | TypeScript 5.9 (strict) |
| Estilos | Tailwind CSS 4.x + CSS Variables |
| Hosting | Vercel (Static + Edge Network) |
| Analytics | Vercel Analytics |
| Contenido | Markdown + gray-matter + ngx-markdown |
| Syntax highlighting | Prism.js |
| Build | Angular CLI + esbuild |
| PWA | Angular Service Worker |

## 🚀 Demo Live

👉 **[azotodev.com](https://azotodev.com)**

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Standalone components (lazy loaded)
│   │   ├── home/             # Hero, terminal widget, stats
│   │   ├── projects/         # Galería de proyectos
│   │   ├── project-detail/   # Detalle por ID
│   │   ├── article-list/     # Índice del blog
│   │   ├── article/          # Artículo individual (lee .md)
│   │   ├── breadcrumb/       # Navegación estructurada
│   │   ├── cv-viewer/        # Visor de CV en PDF
│   │   └── error/            # 404
│   ├── services/
│   │   ├── metadata.service.ts   # SEO: meta, OG, Twitter, Schema.org
│   │   ├── theme.service.ts      # Dark/light mode
│   │   └── breadcrumb.service.ts
│   └── models/
│       └── project.model.ts
├── assets/
│   ├── articles.json         # Índice de artículos (solo metadatos)
│   ├── projects.json         # Datos de proyectos
│   ├── articles/             # Artículos en .md con frontmatter
│   └── images/               # WebP optimizadas (1200x630 para OG)
├── public/
│   ├── sitemap.xml           # Generado automáticamente
│   ├── robots.txt
│   └── manifest.webmanifest
└── styles.scss               # @use "tailwindcss" + CSS variables de tema
```

## 💻 Desarrollo Local

```bash
# Clonar e instalar
git clone https://github.com/ManuPunk16/AzottoDev.git
cd AzottoDev
npm install

# Desarrollo
npm start           # ng serve

# Generar sitemap
npm run generate:sitemap

# Build de producción
npm run build       # genera sitemap + build optimizado

# Deploy a Vercel
npm run deploy:vercel
```

## 🎯 Características Técnicas

### Angular 21 Moderno

```typescript
// Signals + inject() + OnPush — el estándar del proyecto
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly http = inject(HttpClient);

  protected readonly loading = signal(true);
  protected readonly projects = signal<Project[]>([]);
  protected readonly featured = computed(() =>
    this.projects().filter(p => p.featured)
  );
}
```

### Sistema de Artículos en Markdown

```markdown
---
slug: "angular-signals-tutorial"
title: "Angular Signals: el fin de Zone.js (y cómo sobrevivirlo)"
description: "Aprende Signals desde cero en Angular 21."
date: "2026-04-10"
author: "Luis Hernández"
category: "Frontend"
tags: ["Angular", "Signals", "TypeScript"]
image: "/assets/images/articles/angular-signals.webp"
readTime: 8
featured: true
---

# Contenido del artículo aquí...
```

### SEO y Schema.org

- Meta tags dinámicos por ruta con `MetadataService`
- Schema.org `Person` en Home, `BlogPosting` en artículos
- Sitemap XML generado automáticamente con `npm run generate:sitemap`
- Canonical URLs correctas en todas las páginas
- OG Images 1200x630 WebP por artículo

### Tailwind CSS 4.x + CSS Variables

```scss
/* styles.scss */
@use "tailwindcss";

:root {
  --accent: #8B5CF6;
  --bg-primary: #e7e7e7;
  --text-primary: #111827;
}

[data-theme="dark"] {
  --accent: #A855F7;
  --bg-primary: #111827;
  --text-primary: #F9FAFB;
}
```

## 📈 Performance & SEO

| Métrica | Objetivo |
|---------|---------|
| Lighthouse Performance | > 95 |
| SEO Score | 100/100 |
| First Contentful Paint | < 1.2s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Core Web Vitals | ✅ Todas verdes |

## 🔧 Scripts

```bash
npm start                   # Servidor de desarrollo
npm run build               # Build producción (genera sitemap)
npm run generate:sitemap    # Genera sitemap.xml
npm run deploy:vercel       # Deploy a producción
npm test                    # Tests unitarios
```

## 🤖 Sistema de Agentes (`.claude/`)

El proyecto usa un sistema de agentes AI especializados para mantener consistencia:

| Agente | Archivo | Dominio |
|--------|---------|---------|
| 🏗️ Senior Full Stack Dev | `agent_architect.md` | Angular, TypeScript, arquitectura |
| 📈 SEO & Growth Manager | `agent_seo_content.md` | SEO, AEO, keywords, Schema.org |
| ✍️ Marketing & Copywriter | `agent_marketing_copy.md` | Copy, tono de marca, microtextos |
| 🎨 UX/UI Strategist | `agent_ui_ux.md` | Tailwind, WCAG, Mobile-First |

## 👨‍💻 Autor

**Luis Hernández (AzotoDev)** — Desarrollador Full Stack

- 🌐 Portfolio: [azotodev.com](https://azotodev.com)
- 💼 LinkedIn: [linkedin.com/in/azotodev](https://www.linkedin.com/in/azotodev/)
- 🐙 GitHub: [github.com/ManuPunk16](https://github.com/ManuPunk16)
- 🐦 X (Twitter): [@azotodev](https://x.com/azotodev)
- 📧 Email: [azzoto@icloud.com](mailto:azzoto@icloud.com)

## 📄 Licencia

MIT — ver `LICENSE` para más detalles.

---

*Construido con Angular 21, desplegado en Vercel. Performance 95+, SEO 100/100, sin excusas.*
