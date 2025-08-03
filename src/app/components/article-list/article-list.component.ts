import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

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
    DatePipe,
    NgClass
],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  featuredArticles: Article[] = []; // Añade esta propiedad
  loading: boolean = true;
  error: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Article[]>('/assets/articles.json').subscribe({
      next: (data) => {
        this.articles = data;
        // Filtra los artículos destacados
        this.featuredArticles = data.filter(article => article.featured);
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
