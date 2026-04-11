# 🧠 AzottoDev — Principal Engineer Orchestrator

> Portfolio personal de **Luis Hernández** (`azotodev.com`) — Vitrina técnica, generador de confianza y máquina de leads.

---

## 🤖 Sistema de Agentes Especializados

Antes de cualquier cambio, identifica el dominio y carga el agente correspondiente:

| Agente | Archivo | Cuándo usarlo |
|--------|---------|---------------|
| 🏗️ **Senior Full Stack Dev** | `agent_architect.md` | Código Angular, servicios, rutas, signals, migración de artículos a MD |
| 📈 **SEO & Growth Manager** | `agent_seo_content.md` | Metadatos, Schema.org, AEO, keywords, sitemap, artículos nuevos |
| ✍️ **Marketing & Copywriter** | `agent_marketing_copy.md` | Copy de UI, hero, proyectos, artículos, tono de marca, microtextos |
| 🎨 **UX/UI Strategist** | `agent_ui_ux.md` | Tailwind 4.x, componentes, accesibilidad WCAG, Mobile-First, animaciones |

**Regla:** Si la tarea cruza dominios (ej. nuevo componente de artículo), carga los agentes de Arquitectura **y** UI/UX.

---

## 🛠️ Stack Tecnológico Canon

| Capa | Tecnología | Notas críticas |
|------|-----------|----------------|
| Framework | Angular **21.x+** | Standalone por defecto, sin `standalone: true` explícito |
| Lenguaje | TypeScript **5.9+** | `strict: true` siempre |
| Estilos | Tailwind CSS **4.x** | `@use "tailwindcss"`, sin Angular Material |
| Hosting | **Vercel** | Static build + Edge Network. **Sin Firebase.** |
| Analytics | `@vercel/analytics` | Único sistema de analytics permitido |
| Contenido | Markdown + gray-matter | Artículos en `.md` con frontmatter. **Sin `.json` para artículos.** |
| Markdown render | ngx-markdown + Prism.js | |
| PWA | Angular Service Worker | |

---

## ⛔ Restricciones Absolutas

Estas reglas no tienen excepciones:

1. **Firebase eliminado** — `@angular/fire`, `provideFirebaseApp`, `provideAnalytics`, `ScreenTrackingService` no existen en este proyecto.
2. **Angular Material prohibido** — Tailwind 4.x para todo.
3. **Constructores prohibidos** — usar `inject()` en todos los componentes y servicios.
4. **Artículos en `.md`** — no crear ni modificar `.json` para contenido de artículos.
5. **`standalone: true` innecesario** — Angular 21 asume standalone por defecto.
6. **`*ngIf`, `*ngFor`, `*ngSwitch` prohibidos** — usar `@if`, `@for`, `@switch`.
7. **`ngClass` / `ngStyle` prohibidos** — usar `[class]` y `[style]` bindings.
8. **`BehaviorSubject` para estado prohibido** — usar signals.

---

## 📋 Protocolo de Acción

```
1. IDENTIFICA → ¿Es código, contenido, diseño o copy?
2. CARGA → Lee el agente correspondiente
3. VALIDA → Verifica las restricciones absolutas arriba
4. IMPLEMENTA → Código limpio, probado, accesible
5. CROSS-CHECK → Si tocas UI, verifica Mobile-First y WCAG
```

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/           # Standalone components (lazy loaded)
│   │   ├── home/             # Hero, terminal widget, stats
│   │   ├── projects/         # Galería de proyectos
│   │   ├── project-detail/   # Detalle individual por ID
│   │   ├── article-list/     # Blog index
│   │   ├── article/          # Artículo individual (lee .md)
│   │   ├── about/            # (inactivo — activar cuando esté listo)
│   │   ├── contact/          # (inactivo — activar cuando esté listo)
│   │   ├── breadcrumb/       # Componente de navegación
│   │   ├── cv-viewer/        # Visor de CV en PDF
│   │   └── error/            # 404
│   ├── services/
│   │   ├── metadata.service.ts    # Meta tags, OG, Twitter Cards, Schema.org
│   │   ├── meta.service.ts        # Servicio meta alternativo (refactorizar)
│   │   ├── theme.service.ts       # Gestión dark/light mode
│   │   ├── breadcrumb.service.ts  # Breadcrumbs estructurados
│   │   └── sitemap.service.ts     # Generación de sitemap
│   └── models/
│       └── project.model.ts
├── assets/
│   ├── articles.json              # Índice de artículos (solo metadatos)
│   ├── projects.json              # Datos de proyectos
│   ├── articles/                  # ← Artículos en .md con frontmatter
│   │   ├── angular-v19-novedades-rendimiento-signals.json  # ⚠️ MIGRAR A .md
│   │   └── componentes-accesibles-angular-tailwind.json    # ⚠️ MIGRAR A .md
│   └── images/
│       ├── articles/              # OG images WebP 1200x630
│       └── projects/              # Screenshots WebP
└── styles.scss                    # @use "tailwindcss" + CSS variables de tema
```

---

## 🔴 Deuda Técnica Prioritaria

Ordenada por impacto:

1. **Eliminar Firebase** — `app.config.ts` importa `getAnalytics/provideAnalytics` de `@angular/fire`. Eliminar y dejar solo `@vercel/analytics`.
2. **Migrar artículos `.json` → `.md`** — `article.component.ts` lee JSON. Migrar a archivos `.md` con gray-matter.
3. **Migrar constructores a `inject()`** — `ArticleListComponent`, `ProjectsComponent`, `ArticleComponent`, `MetadataService`.
4. **Agregar `ChangeDetectionStrategy.OnPush`** a todos los componentes.
5. **Eliminar `standalone: true`** explícito de todos los decoradores.
6. **Migrar signals** — `loading = true`, `error = false`, etc. deben ser `signal(true)`.

---

## 🚀 Objetivos de Negocio

| KPI | Meta |
|-----|------|
| Lighthouse Performance | > 95 |
| SEO Score | 100/100 |
| Contactos/leads mensuales | ≥ 2 |
| Posición en "Angular developer Mexico" | Top 10 |
| Artículos publicados | ≥ 1/mes |
| Core Web Vitals | ✅ Todas verdes |

---

## 🌐 Dominio y Despliegue

- **Producción:** `https://azotodev.com` (Vercel, dominio personalizado)
- **Build command:** `npm run build` → `npm run generate:sitemap && ng build --configuration production`
- **Dist:** `dist/azottodev/browser`
- **Deploy:** `npm run deploy:vercel`
