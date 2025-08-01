import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

interface ProjectData {
  id: string;
  title: string;
}

interface ArticleData {
  slug: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  
  // ✅ Cache para evitar múltiples requests
  private projectsCache: Map<string, string> = new Map();
  private articlesCache: Map<string, string> = new Map();
  private cacheLoaded = false;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    // Inicializar cache al arrancar
    this.loadCache();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }
  
  getBreadcrumbs() {
    return this.breadcrumbs$.asObservable();
  }

  // ✅ NUEVO: Cargar cache de títulos una sola vez
  private loadCache(): void {
    const projects$ = this.http.get<ProjectData[]>('/assets/projects.json');
    const articles$ = this.http.get<ArticleData[]>('/assets/articles.json');
    
    combineLatest([projects$, articles$]).pipe(
      catchError(error => {
        console.warn('Error cargando cache de breadcrumbs:', error);
        return [[], []]; // Fallback vacío
      })
    ).subscribe(([projects, articles]) => {
      // Llenar cache de proyectos
      projects.forEach(project => {
        this.projectsCache.set(project.id, project.title);
      });
      
      // Llenar cache de artículos
      articles.forEach(article => {
        this.articlesCache.set(article.slug, article.title);
      });
      
      this.cacheLoaded = true;
    //   console.log('📦 Cache de breadcrumbs cargado:', {
    //     projects: this.projectsCache.size,
    //     articles: this.articlesCache.size
    //   });
      
      // Rebuild breadcrumbs si ya estamos en una página
      this.buildBreadcrumbs();
    });
  }
  
  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Inicio', url: '/home', isActive: false }
    ];
    
    const url = this.router.url;
    // console.log('🔄 Construyendo breadcrumbs para:', url);
    
    if (url.startsWith('/projects')) {
      breadcrumbs.push({ label: 'Proyectos', url: '/projects', isActive: false });
      
      const segments = url.split('/');
      if (segments.length > 2) {
        const projectId = segments[2];
        const projectTitle = this.getProjectTitle(projectId);
        
        breadcrumbs.push({ 
          label: projectTitle, 
          url: url, 
          isActive: true 
        });
      } else {
        breadcrumbs[breadcrumbs.length - 1].isActive = true;
      }
    } else if (url.startsWith('/articles')) {
      breadcrumbs.push({ label: 'Artículos', url: '/articles', isActive: false });
      
      const segments = url.split('/');
      if (segments.length > 2) {
        const articleSlug = segments[2];
        const articleTitle = this.getArticleTitle(articleSlug);
        
        breadcrumbs.push({ 
          label: articleTitle, 
          url: url, 
          isActive: true 
        });
      } else {
        breadcrumbs[breadcrumbs.length - 1].isActive = true;
      }
    } else if (url === '/' || url === '/home') {
      breadcrumbs[0].isActive = true;
    }
    
    // console.log('✅ Breadcrumbs construidos:', breadcrumbs);
    this.breadcrumbs$.next(breadcrumbs);
    this.updateBreadcrumbStructuredData(breadcrumbs);
  }
  
  // ✅ MEJORADO: Obtener título con cache
  private getProjectTitle(projectId: string): string {
    if (this.cacheLoaded && this.projectsCache.has(projectId)) {
      return this.projectsCache.get(projectId)!;
    }
    
    // ✅ Fallback temporal mientras carga el cache
    const fallbackTitles: { [key: string]: string } = {
      'azotodev': 'AzotoDev Portfolio',
      'control-inventario': 'Sistema de Control de Inventario',
      'gestion-documental': 'Plataforma de Gestión Documental',
      'tickets-soporte': 'Sistema de Tickets de Soporte'
    };
    
    return fallbackTitles[projectId] || 'Proyecto';
  }
  
  // ✅ MEJORADO: Obtener título de artículo con cache
  private getArticleTitle(slug: string): string {
    if (this.cacheLoaded && this.articlesCache.has(slug)) {
      return this.articlesCache.get(slug)!;
    }
    
    // ✅ Fallback temporal
    const fallbackTitles: { [key: string]: string } = {
      'introduccion-a-angular': 'Introducción a Angular',
      'componentes-accesibles-angular-tailwind': 'Componentes Accesibles con Angular y Tailwind'
    };
    
    return fallbackTitles[slug] || 'Artículo';
  }
  
  private updateBreadcrumbStructuredData(breadcrumbs: Breadcrumb[]): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.label,
        "item": `https://azotodev.web.app${crumb.url}`
      }))
    };
    
    // Remover breadcrumb script anterior
    const existingScript = document.querySelector('script[data-breadcrumb="true"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
  
  // ✅ NUEVO: Método público para actualizar cache manualmente
  public refreshCache(): void {
    this.cacheLoaded = false;
    this.projectsCache.clear();
    this.articlesCache.clear();
    this.loadCache();
  }
  
  // ✅ NUEVO: Método para precargar título específico
  public preloadProjectTitle(projectId: string): void {
    if (!this.projectsCache.has(projectId)) {
      this.http.get<ProjectData>(`/assets/projects/${projectId}.json`).pipe(
        catchError(() => [{ id: projectId, title: 'Proyecto' }])
      ).subscribe(project => {
        this.projectsCache.set(project.id, project.title);
      });
    }
  }
}