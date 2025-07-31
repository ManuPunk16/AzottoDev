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
    this.title.setTitle(pageTitle);

    // Description
    const description = data.description || this.baseDescription;
    this.meta.updateTag({ name: 'description', content: description });

    // Keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: data.url || this.baseUrl });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });

    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
    }

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }

    // Article específico
    if (data.type === 'article') {
      if (data.publishedDate) {
        this.meta.updateTag({ property: 'article:published_time', content: data.publishedDate });
      }
      if (data.modifiedDate) {
        this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedDate });
      }
      this.meta.updateTag({ property: 'article:author', content: 'Luis Hernández' });
    }

    // Canonical
    this.meta.updateTag({ rel: 'canonical', href: data.url || this.baseUrl });
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