import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface MetaConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private readonly baseUrl = 'https://azotodev.web.app';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {}

  updateMeta(config: MetaConfig): void {
    // Actualizar título
    this.title.setTitle(config.title);

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Keywords
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ 
      property: 'og:url', 
      content: config.canonical || `${this.baseUrl}${this.router.url}` 
    });

    if (config.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: config.ogImage });
    }

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    
    if (config.ogImage) {
      this.meta.updateTag({ name: 'twitter:image', content: config.ogImage });
    }

    // Canonical URL - DINÁMICO
    this.updateCanonical(config.canonical);

    // Robots
    if (config.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    }
  }

  private updateCanonical(customCanonical?: string): void {
    const canonicalUrl = customCanonical || `${this.baseUrl}${this.router.url}`;
    
    // Remover canonical existente
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Agregar nuevo canonical
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  // Helper para generar meta tags específicos por tipo de página
  generateProjectMeta(project: any): MetaConfig {
    return {
      title: `${project.title} | Proyecto de Desarrollo Web | AzottoDev`,
      description: project.seo?.metaDescription || project.description,
      keywords: project.seo?.keywords?.join(', ') || project.keywords?.join(', '),
      ogImage: project.seo?.ogImage || project.imageUrl,
      canonical: `${this.baseUrl}/projects/${project.id}`
    };
  }

  generateArticleMeta(article: any): MetaConfig {
    return {
      title: `${article.title} | Blog Técnico | AzottoDev`,
      description: article.excerpt || article.description,
      keywords: article.tags?.join(', '),
      ogImage: article.image,
      canonical: `${this.baseUrl}/articles/${article.slug}`
    };
  }

  generateHomeMeta(): MetaConfig {
    return {
      title: 'Luis Hernández | Desarrollador Full Stack Angular & TypeScript | Portfolio Profesional',
      description: 'Portfolio de Luis Hernández, desarrollador Full Stack especializado en Angular, TypeScript y Tailwind CSS. Sistemas de inventario, control de gestión y aplicaciones web modernas. Más de 5 años de experiencia.',
      keywords: 'desarrollador full stack, angular developer, typescript, tailwind css, sistemas inventario, control gestión, portfolio desarrollador, luis hernández, desarrollo web, frontend backend',
      ogImage: `${this.baseUrl}/assets/images/og-image.webp`,
      canonical: this.baseUrl
    };
  }

  generateProjectsPageMeta(): MetaConfig {
    return {
      title: 'Proyectos | Portfolio de Desarrollo Web | AzottoDev',
      description: 'Explora mis proyectos de desarrollo web: sistemas de inventario, control de gestión, aplicaciones Angular y más. Cada proyecto incluye tecnologías utilizadas, desafíos superados y resultados obtenidos.',
      keywords: 'proyectos desarrollo web, portfolio angular, sistemas inventario, control gestión, aplicaciones web, typescript projects',
      ogImage: `${this.baseUrl}/assets/images/projects-hero.webp`,
      canonical: `${this.baseUrl}/projects`
    };
  }

  generateArticlesPageMeta(): MetaConfig {
    return {
      title: 'Artículos Técnicos | Blog de Desarrollo Web | AzottoDev',
      description: 'Blog técnico sobre desarrollo web moderno: Angular, TypeScript, mejores prácticas, tutoriales y guías para desarrolladores.',
      keywords: 'blog desarrollo web, angular tutorials, typescript tips, desarrollo frontend, mejores prácticas',
      ogImage: `${this.baseUrl}/assets/images/blog-hero.webp`,
      canonical: `${this.baseUrl}/articles`
    };
  }
}