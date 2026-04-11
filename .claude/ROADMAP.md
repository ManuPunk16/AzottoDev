# 🗺️ ROADMAP — AzottoDev Portfolio
> Generado por el Comité de Agentes | Fecha: Abril 2026

---

## 🏥 Diagnóstico del Comité

### 🔴 BUGS CRÍTICOS (corregidos en esta sesión)

| # | Bug | Impacto | Estado |
|---|-----|---------|--------|
| B1 | `@angular/fire` activo en `app.config.ts` (`provideAnalytics`, `ScreenTrackingService`) | 🔴 Build roto | ✅ Corregido |
| B2 | `provideServiceWorker` registrado **dos veces** | 🔴 Conflicto runtime SW | ✅ Corregido |
| B3 | `projects.json` referenciaba Firebase (`demoUrl: azotodev.web.app`, tech: "Firebase") | 🟡 Datos incorrectos | ✅ Corregido |
| B4 | `@angular/fire` en `package.json` como dependencia activa | 🔴 Bundle con código muerto | ✅ Corregido |

### 🟡 DEUDA TÉCNICA DETECTADA (pendiente)

| # | Problema | Agente responsable | Sprint |
|---|----------|--------------------|--------|
| D1 | Constructores en lugar de `inject()` (5 archivos) | 🏗️ Arquitecto | Sprint 1 |
| D2 | Artículos leen `.json` — debe ser `.md` con gray-matter | 🏗️ Arquitecto | Sprint 1 |
| D3 | `standalone: true` explícito en Angular 21 | 🏗️ Arquitecto | Sprint 1 |
| D4 | `loading`/`error` como `boolean`, no signals | 🏗️ Arquitecto | Sprint 1 |
| D5 | Ningún componente tiene `ChangeDetectionStrategy.OnPush` | 🏗️ Arquitecto | Sprint 1 |
| D6 | Dos servicios de meta (`MetaService` + `MetadataService`) — inconsistencia | 🏗️ Arquitecto | Sprint 2 |
| D7 | `NgClass` importado en `ArticleComponent` (prohibido) | 🎨 UI/UX | Sprint 1 |
| D8 | `CommonModule` importado en varios componentes (en Angular 21 se importan individualmente) | 🏗️ Arquitecto | Sprint 2 |
| D9 | VentaSimple sin imagen en `projects.json` (`venta-simple-main.webp` faltante) | 🎨 UI/UX | Sprint 2 |
| D10 | `generate-sitemap.js` no incluye el nuevo proyecto VentaSimple | 📈 SEO | Sprint 1 |

---

## 🚀 ROADMAP POR SPRINTS

---

### 🔴 SPRINT 0 — Hotfix (COMPLETADO HOY)
> *"Antes de construir, hay que dejar de quemar"*

- [x] Eliminar Firebase de `app.config.ts` (`provideAnalytics`, `ScreenTrackingService`)
- [x] Eliminar `@angular/fire` de `package.json`
- [x] Eliminar `provideServiceWorker` duplicado
- [x] Corregir `projects.json` (URLs y tecnologías Firebase)
- [x] Agregar VentaSimple a `projects.json` y `src/assets/projects/`

---

### 🟠 SPRINT 1 — Modernización Angular 21 + Artículos MD
> *"El código que ven los reclutadores debe ser el mejor del portafolio"*  
> Agentes: 🏗️ Arquitecto + 📈 SEO

**Objetivo:** Eliminar toda la deuda técnica de Angular y migrar artículos a Markdown.

#### Tarea 1.1 — Migrar `article.component.ts` a leer `.md`
- Crear servicio `ArticleService` con `inject()`
- Usar `gray-matter` para parsear frontmatter
- Renderizar cuerpo con `ngx-markdown`
- Eliminar las interfaces `ArticleContentBlock` y `ArticleData` del JSON

#### Tarea 1.2 — Migrar artículos existentes a `.md`
- Convertir `angular-v19-novedades-rendimiento-signals.json` → `.md`
- Convertir `componentes-accesibles-angular-tailwind.json` → `.md`
- Actualizar `articles.json` (solo metadatos, sin `content`)

#### Tarea 1.3 — Modernizar todos los componentes
Para cada componente (`ArticleComponent`, `ArticleListComponent`, `ProjectsComponent`, `ProjectDetailComponent`, `HomeComponent`):
- [ ] `constructor` → `inject()`
- [ ] `loading = false` → `loading = signal(false)`
- [ ] `error = false` → `error = signal(false)`
- [ ] Agregar `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Quitar `standalone: true` explícito
- [ ] Reemplazar `NgClass` con binding `[class]`
- [ ] Reemplazar `CommonModule` con imports individuales

#### Tarea 1.4 — Corregir sitemap
- Agregar VentaSimple al `generate-sitemap.js`

---

### 🟡 SPRINT 2 — Nuevo Proyecto VentaSimple + Imagen
> *"Un proyecto en desarrollo es 10 veces más atractivo que uno que 'próximamente'"*  
> Agentes: 🏗️ Arquitecto + 🎨 UI/UX + ✍️ Marketing

**Objetivo:** VentaSimple visible y atractivo en el portfolio.

#### Tarea 2.1 — Imagen placeholder para VentaSimple
- Crear `venta-simple-main.webp` (1200x630, puede ser placeholder con texto hasta tener screenshot real)

#### Tarea 2.2 — Consolidar MetaService
- Unificar `MetaService` + `MetadataService` en un solo servicio
- Migrar todos los componentes al servicio unificado

#### Tarea 2.3 — Schema.org para proyectos
- Agregar `SoftwareApplication` Schema.org en `project-detail.component`
- Agregar `Person` + `WebSite` Schema.org en home

#### Tarea 2.4 — Activar ruta `/about`
- Revisar `about.component` y activar ruta cuando el contenido esté listo

---

### 🟢 SPRINT 3 — SEO 100/100 + AEO
> *"Que te encuentren antes de que te busquen"*  
> Agentes: 📈 SEO + ✍️ Marketing

**Objetivo:** Posicionamiento #1 para "Angular developer Mexico".

#### Tarea 3.1 — Artículo nuevo: Angular 21
- Crear `angular-21-signals-guia-completa.md`
- Estructura AEO: preguntas en H2, respuesta en primer párrafo
- Mínimo 1,500 palabras

#### Tarea 3.2 — Artículo nuevo: Tailwind 4.x + Angular
- Crear `tailwind-4-angular-21-guia.md`
- Target keyword: "Tailwind CSS 4 Angular"

#### Tarea 3.3 — Revisar y completar keywords en MetadataService
- Agregar keywords en inglés para tráfico internacional
- Verificar `og:locale` = `es_MX`

#### Tarea 3.4 — robots.txt y sitemap
- Verificar frecuencias de cambio en sitemap
- Agregar `Sitemap:` al robots.txt

---

### 🔵 SPRINT 4 — UX/Performance + PWA
> *"95 de Lighthouse no es un logro, es el mínimo aceptable"*  
> Agentes: 🎨 UI/UX + 🏗️ Arquitecto

**Objetivo:** Performance 98+, WCAG AA completo, PWA impecable.

#### Tarea 4.1 — Skeleton screens
- Agregar skeletons en `article-list`, `projects`, `article`

#### Tarea 4.2 — `@defer` en secciones below-the-fold
- Aplicar defer en secciones de skills, experiencia y artículos secundarios del home

#### Tarea 4.3 — Skip link + ARIA landmarks
- Agregar skip link en `app.component.html`
- Verificar landmarks semánticos en todas las páginas

#### Tarea 4.4 — Optimizar imágenes
- Todos los `<img>` → `NgOptimizedImage`
- `priority` en imagen hero (LCP)
- `aspect-ratio` fijo en cards (CLS)

---

### ⚪ SPRINT 5 — Contacto + CV + Growth
> *"El portafolio perfecto genera leads, no solo visitas"*  
> Agentes: ✍️ Marketing + 📈 SEO + 🎨 UI/UX

**Objetivo:** Activar el funnel de conversión.

#### Tarea 5.1 — Activar `/contact`
- Formulario con Resend o Formspree (sin backend propio)
- Validación con Angular Reactive Forms
- Mensaje de confirmación con humor dev

#### Tarea 5.2 — Mejorar CV Viewer
- Verificar que el PDF está actualizado
- Analytics en descarga/visualización del CV

#### Tarea 5.3 — Newsletter / RSS (opcional)
- RSS feed para artículos (genera credibilidad)

---

## 📊 INVENTARIO COMPLETO DE ARCHIVOS

### Componentes y su estado actual

| Componente | `inject()` | Signals | OnPush | Sin standalone explicit | Control Flow |
|-----------|-----------|---------|--------|------------------------|-------------|
| `HomeComponent` | ✅ parcial | ❌ | ❌ | ❌ | ❌ |
| `ProjectsComponent` | ❌ constructor | ❌ | ❌ | ❌ | desconocido |
| `ProjectDetailComponent` | ❌ constructor | ❌ | ❌ | ❌ | desconocido |
| `ArticleListComponent` | ❌ constructor | ❌ | ❌ | ❌ | desconocido |
| `ArticleComponent` | ❌ constructor | ❌ | ❌ | ❌ | desconocido |
| `AppComponent` | ✅ inject | ❌ | ❌ | ❌ | desconocido |
| `BreadcrumbComponent` | desconocido | desconocido | desconocido | desconocido | desconocido |
| `ErrorComponent` | desconocido | desconocido | desconocido | desconocido | desconocido |

### Servicios y su estado

| Servicio | `inject()` | Signals | Consolidado |
|---------|-----------|---------|-------------|
| `MetadataService` | ❌ constructor | N/A | Duplicado con MetaService |
| `MetaService` | ❌ constructor | N/A | Duplicado con MetadataService |
| `ThemeService` | desconocido | desconocido | OK |
| `BreadcrumbService` | desconocido | desconocido | OK |

### Artículos — estado de migración

| Artículo | Formato actual | Meta en articles.json | Estado |
|---------|---------------|----------------------|--------|
| `angular-v19-novedades-rendimiento-signals` | `.json` ❌ | ✅ | ⚠️ Migrar a .md |
| `componentes-accesibles-angular-tailwind` | `.json` ❌ | ✅ | ⚠️ Migrar a .md |

### Proyectos — estado

| Proyecto | En `projects.json` | JSON detalle | Firebase limpio | Imagen existe |
|---------|------------------|-------------|-----------------|---------------|
| azotodev | ✅ | ✅ actualizado | ✅ | ✅ |
| venta-simple | ✅ nuevo | ✅ nuevo | N/A | ❌ falta .webp |
| control-inventario | ✅ | ✅ | ✅ | ❌ verificar |
| gestion-documental | ✅ | ✅ | ✅ | ❌ verificar |
| tickets-soporte | ✅ | ✅ | ✅ | ❌ verificar |

---

## 🎯 PRÓXIMAS ACCIONES INMEDIATAS

En orden estricto de prioridad:

1. `npm install` — para sincronizar la eliminación de `@angular/fire`
2. Migrar `article.component.ts` a leer `.md` (Tarea 1.1)
3. Convertir los 2 artículos `.json` a `.md` (Tarea 1.2)
4. Modernizar `ProjectsComponent` con signals + inject() (Tarea 1.3)
5. Agregar VentaSimple al sitemap (Tarea 1.4)

---

*Roadmap generado por el comité de agentes: 🏗️ Arquitecto + 📈 SEO + ✍️ Marketing + 🎨 UI/UX*
