# Graph Report - AzottoDev  (2026-07-06)

## Corpus Check
- 64 files · ~92,257 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 672 nodes · 742 edges · 54 communities (29 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b00070c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Components & Meta Services|Core Components & Meta Services]]
- [[_COMMUNITY_Project Registry & Theme Management|Project Registry & Theme Management]]
- [[_COMMUNITY_AI Agent Roles & Roadmap|AI Agent Roles & Roadmap]]
- [[_COMMUNITY_Routing, Bootstrap & Navigation|Routing, Bootstrap & Navigation]]
- [[_COMMUNITY_Mobile Dark Theme UI|Mobile Dark Theme UI]]
- [[_COMMUNITY_WCAG Conformance Levels|WCAG Conformance Levels]]
- [[_COMMUNITY_Dark Theme Desktop Layout|Dark Theme Desktop Layout]]
- [[_COMMUNITY_Angular 19 Features Article|Angular 19 Features Article]]
- [[_COMMUNITY_Articles & Component Accessibility Registries|Articles & Component Accessibility Registries]]
- [[_COMMUNITY_White Theme Desktop Layout|White Theme Desktop Layout]]
- [[_COMMUNITY_White Theme Mobile Layout|White Theme Mobile Layout]]
- [[_COMMUNITY_Accessibility Component Banner|Accessibility Component Banner]]
- [[_COMMUNITY_Portfolio Project Assets|Portfolio Project Assets]]
- [[_COMMUNITY_Azotto Visual Identity|Azotto Visual Identity]]
- [[_COMMUNITY_Brand Identity Icon Assets|Brand Identity Icon Assets]]
- [[_COMMUNITY_Package & Deployment Configuration|Package & Deployment Configuration]]
- [[_COMMUNITY_PostCSS & Tailwind Styles|PostCSS & Tailwind Styles]]
- [[_COMMUNITY_Robots & Sitemap Generation|Robots & Sitemap Generation]]
- [[_COMMUNITY_Graphify Configuration & Workflow|Graphify Configuration & Workflow]]
- [[_COMMUNITY_About View Component|About View Component]]
- [[_COMMUNITY_Contact View Component|Contact View Component]]
- [[_COMMUNITY_English Curriculum Vitae|English Curriculum Vitae]]
- [[_COMMUNITY_Spanish Curriculum Vitae|Spanish Curriculum Vitae]]
- [[_COMMUNITY_Error Handling View|Error Handling View]]
- [[_COMMUNITY_Brand Icon Assets|Brand Icon Assets]]
- [[_COMMUNITY_Brand Icon 144x144|Brand Icon 144x144]]
- [[_COMMUNITY_Brand Icon 152x152|Brand Icon 152x152]]
- [[_COMMUNITY_Brand Icon 192x192|Brand Icon 192x192]]
- [[_COMMUNITY_Brand Icon 384x384|Brand Icon 384x384]]
- [[_COMMUNITY_Brand Icon 72x72|Brand Icon 72x72]]
- [[_COMMUNITY_Project Images|Project Images]]
- [[_COMMUNITY_Project Metrics|Project Metrics]]
- [[_COMMUNITY_Project Team|Project Team]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Repomix Config|Repomix Config]]
- [[_COMMUNITY_Metadata Config|Metadata Config]]
- [[_COMMUNITY_SEO Meta Tags Config|SEO Meta Tags Config]]
- [[_COMMUNITY_Sitemap Service|Sitemap Service]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `MetadataService` - 31 edges
2. `HomeComponent` - 24 edges
3. `ProjectDetailComponent` - 23 edges
4. `ArticleComponent` - 21 edges
5. `MetaService` - 21 edges
6. `output` - 18 edges
7. `AzottoDev — Style Reference` - 17 edges
8. `CvViewerComponent` - 16 edges
9. `ProjectsComponent` - 16 edges
10. `BreadcrumbService` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Senior Full Stack Dev Agent` --semantically_similar_to--> `GitHub Copilot Instructions`  [INFERRED] [semantically similar]
  .claude/agent_architect.md → .github/copilot-instructions.md
- `Sitemap Generator Script` --conceptually_related_to--> `Robots.txt`  [INFERRED]
  scripts/generate-sitemap.js → public/robots.txt
- `ArticleComponent` --semantically_similar_to--> `ArticleListComponent`  [INFERRED] [semantically similar]
  src/app/components/article/article.component.ts → src/app/components/article-list/article-list.component.ts
- `MetaService` --semantically_similar_to--> `MetadataService`  [INFERRED] [semantically similar]
  src/app/services/meta.service.ts → src/app/services/metadata.service.ts
- `Package Manifest` --references--> `Vercel Configuration`  [INFERRED]
  package.json → vercel.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Agents Coordination** — claude_orchestrator, agent_architect, agent_ui_ux, agent_seo_content, agent_marketing_copy [EXTRACTED 1.00]
- **Fullstack Portfolio Projects** — projects_control_inventario, projects_gestion_documental, projects_venta_simple [INFERRED 0.85]
- **WCAG Conformance Levels Hierarchy** — articles_wcag_levels_wcag_level_a, articles_wcag_levels_wcag_level_aa, articles_wcag_levels_wcag_level_aaa [EXTRACTED 1.00]

## Communities (54 total, 25 thin omitted)

### Community 0 - "Core Components & Meta Services"
Cohesion: 0.06
Nodes (6): Project, ProjectImage, ProjectMetrics, ProjectTeam, ProjectDetailComponent, ProjectsComponent

### Community 1 - "Project Registry & Theme Management"
Cohesion: 0.16
Nodes (7): Projects Registry, AzottoDev Portfolio, Sistema de Control de Inventario, Plataforma de Gestión Documental, Sistema de Tickets de Soporte, VentaSimple — Micro-POS SaaS, ThemeService

### Community 2 - "AI Agent Roles & Roadmap"
Cohesion: 0.05
Nodes (42): Senior Full Stack Dev Agent, Copywriter & Marketing Strategist Agent, Growth Product Manager & SEO Manager Agent, UX/UI Strategist & Product Designer Agent, Principal Engineer Orchestrator, Artículos — estado de migración, 🔴 BUGS CRÍTICOS (corregidos en esta sesión), Componentes y su estado actual (+34 more)

### Community 3 - "Routing, Bootstrap & Navigation"
Cohesion: 0.08
Nodes (12): AppComponent, QuickLink, SocialLink, Stat, appConfig, routes, BreadcrumbComponent, ArticleData (+4 more)

### Community 4 - "Mobile Dark Theme UI"
Cohesion: 0.33
Nodes (6): Angular, Mobile Dark Theme Design, Full Stack Developer, Luis Hernández Portfolio Owner, Home Dark Theme Mobile UI, Terminal Mockup Component

### Community 5 - "WCAG Conformance Levels"
Cohesion: 0.67
Nodes (4): WCAG Conformance Levels Diagram, WCAG Level A, WCAG Level AA, WCAG Level AAA

### Community 6 - "Dark Theme Desktop Layout"
Cohesion: 0.50
Nodes (3): Portfolio Home Dark Theme Layout, Portfolio Stat Cards, Terminal Mock Component

### Community 7 - "Angular 19 Features Article"
Cohesion: 0.67
Nodes (3): Angular 19 Novedades y mejoras, Frontend, Angular 19 Article Banner

### Community 8 - "Articles & Component Accessibility Registries"
Cohesion: 0.67
Nodes (3): Angular v19 Novedades, Rendimiento y Signals, Componentes accesibles con Angular y Tailwind CSS, Articles Registry

### Community 9 - "White Theme Desktop Layout"
Cohesion: 0.67
Nodes (3): Home White Theme Image, Portfolio Home Page Layout (White Theme), Luis Hernández Profile Details

### Community 10 - "White Theme Mobile Layout"
Cohesion: 0.67
Nodes (3): AzottoDev Home White Theme Mobile Screenshot, Angular, Luis Hernández

### Community 16 - "PostCSS & Tailwind Styles"
Cohesion: 0.07
Nodes (27): dependencies, @angular/animations, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser (+19 more)

### Community 30 - "Project Images"
Cohesion: 0.06
Nodes (43): build, extract-i18n, serve, test, architect, builder, configurations, defaultConfiguration (+35 more)

### Community 31 - "Project Metrics"
Cohesion: 0.05
Nodes (39): Agent Prompt Guide, Animation Philosophy, AzottoDev — Style Reference, Border Radius, Components, CSS Custom Properties, Dark Section Panel, Dark Testimonial Card (+31 more)

### Community 32 - "Project Team"
Cohesion: 0.06
Nodes (33): 1. Mobile-First Siempre, 2. Touch Targets (Accesibilidad táctil), 3. Contraste WCAG AA, 4. Estados de Foco Visibles, Accesibilidad — Reglas WCAG 2.1 AA, 🎨 Agente UI/UX — UX/UI Strategist & Product Designer, Animaciones y Transiciones, Badges / Pills (+25 more)

### Community 34 - "Repomix Config"
Cohesion: 0.05
Nodes (36): includeDiffs, includeLogs, includeLogsCount, sortByChanges, sortByChangesMaxCommits, ignore, customPatterns, useDefaultPatterns (+28 more)

### Community 35 - "Metadata Config"
Cohesion: 0.29
Nodes (3): Article, ArticleListComponent, MetaConfig

### Community 36 - "SEO Meta Tags Config"
Cohesion: 0.06
Nodes (7): Article, ArticleComponent, ArticleContentBlock, ArticleData, ArticleMetadata, MetadataService, MetaTagsConfig

### Community 38 - "Community 38"
Cohesion: 0.06
Nodes (31): AEO (Answer Engine Optimization) — Para IA y LLMs, 📈 Agente SEO & Growth — Growth Product Manager & SEO Manager, Arquitectura de Contenido, Artículos — Article + BlogPosting, Checklist AEO por Artículo, Checklist SEO por Página, Contexto del Mercado, Core Web Vitals — Objetivos (+23 more)

### Community 39 - "Community 39"
Cohesion: 0.07
Nodes (29): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jasmine-core, karma, karma-chrome-launcher, karma-coverage (+21 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (20): 🏗️ Agente Arquitecto — Senior Full Stack Developer, Checklist pre-commit, Componentes, Convenciones de Archivos, 🔴 Crítico, Estructura de Rutas, Estructura de un artículo, Formato frontmatter obligatorio (+12 more)

### Community 41 - "Community 41"
Cohesion: 0.11
Nodes (18): ✍️ Agente Marketing & Copywriter, Bio estándar (para LinkedIn, GitHub, X), 📝 Blog / Artículos, Checklist de Calidad de Copy, Copy para Errores y Estados Vacíos, Copy por Sección, Copywriting para Artículos Técnicos, Estructura de un artículo de alto impacto (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (16): Angular 21 Moderno, 👨‍💻 Autor, 🌟 AzottoDev — Portfolio Personal de Luis Hernández, 🎨 Características, 🎯 Características Técnicas, 🚀 Demo Live, 💻 Desarrollo Local, 📁 Estructura del Proyecto (+8 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (14): Archivo CSS (.css), Archivo HTML (.html), Archivo TypeScript (.ts), Componentes, Ejemplo de Componente Moderno con Signals, Estructura de Archivos, Gestión de Estado, Mejores Prácticas de Angular (+6 more)

### Community 46 - "Community 46"
Cohesion: 0.15
Nodes (12): prefix, projectType, root, schematics, sourceRoot, newProjectRoot, projects, azottodev (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (11): Achievement, ContactMethod, Experience, Particle, PersonalInterest, ProfessionalValue, QuickLink, Skill (+3 more)

### Community 49 - "Community 49"
Cohesion: 0.20
Nodes (9): 🏗️ Arquitectura del Proyecto, 🧠 AzottoDev — Principal Engineer Orchestrator, 🔴 Deuda Técnica Prioritaria, 🌐 Dominio y Despliegue, 🚀 Objetivos de Negocio, 📋 Protocolo de Acción, ⛔ Restricciones Absolutas, 🤖 Sistema de Agentes Especializados (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 52 - "Community 52"
Cohesion: 0.50
Nodes (3): builds, routes, version

## Knowledge Gaps
- **364 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `style` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MetadataService` connect `SEO Meta Tags Config` to `Core Components & Meta Services`, `Community 48`, `Routing, Bootstrap & Navigation`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `MetaService` connect `Community 48` to `Core Components & Meta Services`, `Metadata Config`, `SEO Meta Tags Config`, `Community 43`, `Community 47`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `HomeComponent` connect `Community 43` to `Community 48`, `Community 50`, `Community 45`, `Community 47`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _365 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Components & Meta Services` be split into smaller, more focused modules?**
  _Cohesion score 0.06219512195121951 - nodes in this community are weakly interconnected._
- **Should `AI Agent Roles & Roadmap` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Routing, Bootstrap & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.08461538461538462 - nodes in this community are weakly interconnected._