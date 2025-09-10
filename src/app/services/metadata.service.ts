import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private readonly baseUrl = 'https://azotodev.com';
  private readonly siteName = 'AzotoDev - Luis Hernández';
  private readonly twitterHandle = '@azotodev';
  private readonly authorName = 'Luis Hernández (AzotoDev)';

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateMetadata(data: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  }) {
    // Título optimizado para SEO
    this.title.setTitle(data.title);

    // Meta tags básicos
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords || 'Angular, TypeScript, Full Stack, Desarrollador, Portfolio, AzotoDev' });
    this.meta.updateTag({ name: 'author', content: data.author || this.authorName });
    this.meta.updateTag({ name: 'creator', content: this.authorName });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' });

    // Open Graph optimizado
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: data.url || this.baseUrl });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });

    if (data.image) {
      const imageUrl = data.image.startsWith('http') ? data.image : `${this.baseUrl}${data.image}`;
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:image:alt', content: data.title });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:type', content: 'image/webp' });
    }

    // Twitter Cards optimizado
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });

    if (data.image) {
      const imageUrl = data.image.startsWith('http') ? data.image : `${this.baseUrl}${data.image}`;
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image:alt', content: data.title });
    }

    // Article specific meta tags
    if (data.type === 'article') {
      if (data.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
      }
      if (data.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedTime });
      }
      if (data.author) {
        this.meta.updateTag({ property: 'article:author', content: data.author });
      }
      if (data.section) {
        this.meta.updateTag({ property: 'article:section', content: data.section });
      }
    }

    // Canonical URL
    this.updateCanonicalUrl(data.url || this.baseUrl);

    // JSON-LD Schema para mejor SEO
    this.updateStructuredData(data);
  }

  private updateCanonicalUrl(url: string) {
    let link: HTMLLinkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  private updateStructuredData(data: any) {
    // Remover script anterior
    const existingScript = document.querySelector('script[data-schema="person"]');
    if (existingScript) {
      existingScript.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Luis Hernández",
      "alternateName": "AzotoDev",
      "description": "Desarrollador Full Stack especializado en Angular, TypeScript y desarrollo web moderno",
      "url": this.baseUrl,
      "image": `${this.baseUrl}/assets/images/profile-azotodev.webp`,
      "sameAs": [
        "https://github.com/ManuPunk16",
        "https://x.com/azotodev",
        "https://www.linkedin.com/in/azotodev/"
      ],
      "jobTitle": "Desarrollador Full Stack",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "knowsAbout": ["Angular", "TypeScript", "JavaScript", "Node.js", "Tailwind CSS", "Firebase", "Vercel"],
      "email": "azzoto@icloud.com"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'person');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  updateHomeMetadata() {
    this.updateMetadata({
      title: 'Luis Hernández (AzotoDev) - Desarrollador Full Stack | Portfolio Angular & TypeScript',
      description: 'Portfolio profesional de Luis Hernández (AzotoDev), desarrollador Full Stack especializado en Angular, TypeScript y desarrollo web moderno. Sistemas de inventario, gestión documental y aplicaciones web innovadoras.',
      keywords: 'Luis Hernández, AzotoDev, Desarrollador Full Stack, Angular Developer, TypeScript, Portfolio, Desarrollo Web, JavaScript, Node.js, Tailwind CSS, Firebase, Vercel',
      image: '/assets/images/og-home.webp',
      url: this.baseUrl,
      type: 'website'
    });
  }

  updateProjectsMetadata() {
    this.updateMetadata({
      title: 'Proyectos | AzotoDev - Portfolio de Desarrollo Web Angular & TypeScript',
      description: 'Explora los proyectos de desarrollo web que he creado: sistemas de inventario, control de gestión, plataformas documentales y aplicaciones Angular modernas. Casos de estudio detallados con tecnologías utilizadas.',
      keywords: 'Proyectos Angular, Portfolio TypeScript, Sistemas Inventario, Control Gestión, Desarrollo Web, Casos de Estudio, AzotoDev',
      image: '/assets/images/og-projects.webp',
      url: `${this.baseUrl}/projects`,
      type: 'website'
    });
  }

  updateArticlesMetadata() {
    this.updateMetadata({
      title: 'Artículos Técnicos | AzotoDev - Blog Angular, TypeScript y Desarrollo Web',
      description: 'Blog técnico sobre desarrollo web moderno: tutoriales Angular, guías TypeScript, mejores prácticas de desarrollo y las últimas tendencias en tecnología web.',
      keywords: 'Blog Desarrollo Web, Tutoriales Angular, Guías TypeScript, Mejores Prácticas, Artículos Técnicos, AzotoDev',
      image: '/assets/images/og-articles.webp',
      url: `${this.baseUrl}/articles`,
      type: 'website'
    });
  }

  updateArticleMetadata(metadata: any) {
    this.updateMetadata({
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      image: metadata.image,
      url: metadata.url,
      type: 'article',
      publishedTime: metadata.publishedTime,
      modifiedTime: metadata.modifiedTime,
      author: metadata.author,
      section: metadata.section
    });
  }

  updatePageMetadata(metadata: any) {
    this.updateMetadata({
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      image: metadata.image,
      url: metadata.url,
      type: metadata.type || 'website'
    });
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getSiteName(): string {
    return this.siteName;
  }

  getAuthorName(): string {
    return this.authorName;
  }
}