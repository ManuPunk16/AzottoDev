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
  private readonly baseUrl = 'https://azotodev.com';
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  
  // Cache para evitar múltiples requests
  private projectsCache: Map<string, string> = new Map();
  private articlesCache: Map<string, string> = new Map();
  private cacheLoaded = false;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
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

  private loadCache(): void {
    const projects$ = this.http.get<ProjectData[]>('/assets/projects.json');
    const articles$ = this.http.get<ArticleData[]>('/assets/articles.json');
    
    combineLatest([projects$, articles$]).pipe(
      catchError(error => {
        console.warn('Error cargando cache de breadcrumbs:', error);
        return [[], []];
      })
    ).subscribe(([projects, articles]) => {
      projects.forEach(project => {
        this.projectsCache.set(project.id, project.title);
      });
      
      articles.forEach(article => {
        this.articlesCache.set(article.slug, article.title);
      });
      
      this.cacheLoaded = true;
      this.buildBreadcrumbs();
    });
  }
  
  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Inicio', url: '/', isActive: false }
    ];
    
    const url = this.router.url;
    
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
    
    this.breadcrumbs$.next(breadcrumbs);
    this.updateBreadcrumbStructuredData(breadcrumbs);
  }
  
  private getProjectTitle(projectId: string): string {
    if (this.cacheLoaded && this.projectsCache.has(projectId)) {
      return this.projectsCache.get(projectId)!;
    }
    
    const fallbackTitles: { [key: string]: string } = {
      'azotodev': 'AzotoDev Portfolio',
      'control-inventario': 'Sistema de Control de Inventario',
      'gestion-documental': 'Plataforma de Gestión Documental',
      'tickets-soporte': 'Sistema de Tickets de Soporte'
    };
    
    return fallbackTitles[projectId] || 'Proyecto';
  }
  
  private getArticleTitle(slug: string): string {
    if (this.cacheLoaded && this.articlesCache.has(slug)) {
      return this.articlesCache.get(slug)!;
    }
    
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
        "item": `${this.baseUrl}${crumb.url}`
      }))
    };
    
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
  
  public refreshCache(): void {
    this.cacheLoaded = false;
    this.projectsCache.clear();
    this.articlesCache.clear();
    this.loadCache();
  }
}