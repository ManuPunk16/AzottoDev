import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private readonly baseTitle = 'Luis Hernández | Desarrollador Full Stack';
  private readonly baseDescription = 'Portfolio profesional de Luis Hernández, desarrollador Full Stack especializado en Angular, TypeScript y sistemas web modernos.';
  private readonly baseUrl = 'https://azotodev.web.app';

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updatePageMetadata(data: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    publishedDate?: string;
    modifiedDate?: string;
  }) {
    // Title
    const pageTitle = data.title ? `${data.title} | ${this.baseTitle}` : this.baseTitle;
    const description = data.description || this.baseDescription;
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    
    // ✅ NUEVO: Keywords dinámicas
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }
    
    // ✅ NUEVO: Hreflang para internacionalización futura
    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });
    
    // ✅ NUEVO: Structured data más detallado
    this.updateStructuredData(data);
  }

  private updateStructuredData(data: any) {
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": data.type === 'article' ? 'Article' : 'WebPage',
      "headline": data.title,
      "description": data.description,
      "author": {
        "@type": "Person",
        "name": "Luis Hernández",
        "url": "https://azotodev.web.app",
        "sameAs": [
          "https://linkedin.com/in/azotodev",
          "https://github.com/azottodev"
        ]
      },
      "publisher": {
        "@type": "Organization", 
        "name": "AzottoDev",
        "url": "https://azotodev.web.app"
      }
    };
    
    if (data.image) {
      structuredData["image"] = data.image;
    }
    
    if (data.publishedDate) {
      structuredData["datePublished"] = data.publishedDate;
      structuredData["dateModified"] = data.modifiedDate || data.publishedDate;
    }
    
    // Remover script anterior y agregar nuevo
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  updateProjectMetadata(project: any) {
    this.updatePageMetadata({
      title: project.title,
      description: project.description,
      keywords: `${project.technologies.join(', ')}, ${project.category}, desarrollo web`,
      image: `${this.baseUrl}${project.imageUrl}`,
      url: `${this.baseUrl}/projects/${project.id}`,
      type: 'website'
    });
  }

  updateArticleMetadata(article: any) {
    this.updatePageMetadata({
      title: article.title,
      description: article.description,
      keywords: article.tags.join(', '),
      image: `${this.baseUrl}${article.image}`,
      url: `${this.baseUrl}/articles/${article.slug}`,
      type: 'article',
      publishedDate: article.date,
      modifiedDate: article.lastUpdated || article.date
    });
  }
}