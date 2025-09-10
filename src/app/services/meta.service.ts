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
  private readonly baseUrl = 'https://azotodev.com';
  private readonly siteName = 'AzotoDev - Luis Hernández';
  private readonly twitterHandle = '@azotodev';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {}

  updateMeta(config: MetaConfig): void {
    // Actualizar título
    this.title.setTitle(config.title);

    // Meta básicos
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'author', content: 'Luis Hernández (AzotoDev)' });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ 
      property: 'og:url', 
      content: config.canonical || `${this.baseUrl}${this.router.url}` 
    });

    if (config.ogImage) {
      const imageUrl = config.ogImage.startsWith('http') ? config.ogImage : `${this.baseUrl}${config.ogImage}`;
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
    
    if (config.ogImage) {
      const imageUrl = config.ogImage.startsWith('http') ? config.ogImage : `${this.baseUrl}${config.ogImage}`;
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    // Canonical URL
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
    
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  generateHomeMeta(): MetaConfig {
    return {
      title: 'Luis Hernández (AzotoDev) - Desarrollador Full Stack | Portfolio Angular & TypeScript',
      description: 'Portfolio profesional de Luis Hernández (AzotoDev), desarrollador Full Stack especializado en Angular, TypeScript y Tailwind CSS. Sistemas de inventario, control de gestión y aplicaciones web modernas.',
      keywords: 'Luis Hernández, AzotoDev, desarrollador full stack, angular developer, typescript, tailwind css, portfolio desarrollador, desarrollo web, sistemas inventario',
      ogImage: `${this.baseUrl}/assets/images/og-home.webp`,
      canonical: this.baseUrl
    };
  }

  generateProjectsPageMeta(): MetaConfig {
    return {
      title: 'Proyectos | AzotoDev - Portfolio de Desarrollo Web Angular & TypeScript',
      description: 'Explora mis proyectos de desarrollo web: sistemas de inventario, control de gestión, plataformas documentales y aplicaciones Angular. Cada proyecto incluye tecnologías utilizadas y casos de estudio.',
      keywords: 'proyectos angular, portfolio typescript, sistemas inventario, control gestión, aplicaciones web, casos de estudio',
      ogImage: `${this.baseUrl}/assets/images/og-projects.webp`,
      canonical: `${this.baseUrl}/projects`
    };
  }

  generateArticlesPageMeta(): MetaConfig {
    return {
      title: 'Artículos Técnicos | AzotoDev - Blog Angular, TypeScript y Desarrollo Web',
      description: 'Blog técnico sobre desarrollo web moderno: tutoriales Angular, guías TypeScript, mejores prácticas de desarrollo y las últimas tendencias en tecnología web.',
      keywords: 'blog desarrollo web, tutoriales angular, guías typescript, mejores prácticas, artículos técnicos',
      ogImage: `${this.baseUrl}/assets/images/og-articles.webp`,
      canonical: `${this.baseUrl}/articles`
    };
  }

  generateProjectMeta(project: any): MetaConfig {
    return {
      title: `${project.title} | AzotoDev - Proyecto de Desarrollo Web`,
      description: project.description || `Proyecto ${project.title} desarrollado con ${project.technologies?.join(', ') || 'tecnologías modernas'}. Explora el caso de estudio completo.`,
      keywords: `${project.title}, ${project.technologies?.join(', ') || ''}, proyecto angular, desarrollo web, azotodev`,
      ogImage: project.images?.[0] ? `${this.baseUrl}/assets/images/projects/${project.id}/${project.images[0]}` : `${this.baseUrl}/assets/images/og-projects.webp`,
      canonical: `${this.baseUrl}/projects/${project.id}`
    };
  }

  generateArticleMeta(article: any): MetaConfig {
    return {
      title: `${article.title} | AzotoDev - Blog Técnico`,
      description: article.description || article.summary || `Artículo técnico sobre ${article.title}. Aprende sobre desarrollo web moderno.`,
      keywords: `${article.title}, ${article.tags?.join(', ') || ''}, tutorial, desarrollo web, azotodev`,
      ogImage: article.image ? `${this.baseUrl}/assets/images/articles/${article.image}` : `${this.baseUrl}/assets/images/og-articles.webp`,
      canonical: `${this.baseUrl}/articles/${article.slug}`
    };
  }
}