import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MetaService } from '../../services/meta.service';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  featured: boolean;
  excerpt: string;
  views?: number;
}

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  featuredArticles: Article[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private http: HttpClient,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.metaService.updateMeta(this.metaService.generateArticlesPageMeta());

    // Luego cargar los datos
    this.http.get<Article[]>('/assets/articles.json').subscribe({
      next: (data) => {
        const mappedArticles = data.map(article => {
          let localViews = 0;
          if (isPlatformBrowser(this.platformId)) {
            const viewsKey = `views_${article.slug}`;
            const saved = localStorage.getItem(viewsKey);
            if (saved) {
              localViews = parseInt(saved, 10);
            } else {
              const seed = Math.abs(article.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 120 + 100;
              localStorage.setItem(viewsKey, seed.toString());
              localViews = seed;
            }
          } else {
            localViews = 150;
          }
          return { ...article, views: localViews };
        });

        this.articles = mappedArticles;
        this.featuredArticles = mappedArticles.filter(article => article.featured);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando artículos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
