# Graph Report - .  (2026-07-06)

## Corpus Check
- 93 files · ~88,859 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 92 nodes · 62 edges · 38 communities (11 shown, 27 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `MetaService` - 6 edges
2. `MetadataService` - 5 edges
3. `Principal Engineer Orchestrator` - 5 edges
4. `Projects Registry` - 5 edges
5. `Home Dark Theme Mobile UI` - 5 edges
6. `BreadcrumbService` - 4 edges
7. `BreadcrumbComponent` - 3 edges
8. `ProjectDetailComponent` - 3 edges
9. `AppConfig` - 3 edges
10. `WCAG Conformance Levels Diagram` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Senior Full Stack Dev Agent` --semantically_similar_to--> `GitHub Copilot Instructions`  [INFERRED] [semantically similar]
  .claude/agent_architect.md → .github/copilot-instructions.md
- `Sitemap Generator Script` --conceptually_related_to--> `Robots.txt`  [INFERRED]
  scripts/generate-sitemap.js → public/robots.txt
- `Package Manifest` --references--> `Vercel Configuration`  [INFERRED]
  package.json → vercel.json
- `ArticleComponent` --semantically_similar_to--> `ArticleListComponent`  [INFERRED] [semantically similar]
  src/app/components/article/article.component.ts → src/app/components/article-list/article-list.component.ts
- `MetaService` --semantically_similar_to--> `MetadataService`  [INFERRED] [semantically similar]
  src/app/services/meta.service.ts → src/app/services/metadata.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI Agents Coordination** — claude_orchestrator, agent_architect, agent_ui_ux, agent_seo_content, agent_marketing_copy [EXTRACTED 1.00]
- **Fullstack Portfolio Projects** — projects_control_inventario, projects_gestion_documental, projects_venta_simple [INFERRED 0.85]
- **WCAG Conformance Levels Hierarchy** — articles_wcag_levels_wcag_level_a, articles_wcag_levels_wcag_level_aa, articles_wcag_levels_wcag_level_aaa [EXTRACTED 1.00]

## Communities (38 total, 27 thin omitted)

### Community 0 - "Core Components & Meta Services"
Cohesion: 0.33
Nodes (9): ArticleComponent, ArticleListComponent, CvViewerComponent, HomeComponent, Project, ProjectDetailComponent, ProjectsComponent, MetaService (+1 more)

### Community 1 - "Project Registry & Theme Management"
Cohesion: 0.25
Nodes (8): Projects Registry, AzottoDev Portfolio, Sistema de Control de Inventario, Plataforma de Gestión Documental, Sistema de Tickets de Soporte, VentaSimple — Micro-POS SaaS, ThemeService Spec, ThemeService

### Community 2 - "AI Agent Roles & Roadmap"
Cohesion: 0.29
Nodes (7): Senior Full Stack Dev Agent, Copywriter & Marketing Strategist Agent, Growth Product Manager & SEO Manager Agent, UX/UI Strategist & Product Designer Agent, Principal Engineer Orchestrator, Project Roadmap, GitHub Copilot Instructions

### Community 3 - "Routing, Bootstrap & Navigation"
Cohesion: 0.38
Nodes (7): AppComponent, AppConfig, AppRoutes, BreadcrumbComponent, Breadcrumb, BreadcrumbService, Main Bootstrap

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

## Knowledge Gaps
- **63 isolated node(s):** `AboutComponent`, `ContactComponent`, `CvViewerComponent`, `ErrorComponent`, `ProjectsComponent` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AboutComponent`, `ContactComponent`, `CvViewerComponent` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._