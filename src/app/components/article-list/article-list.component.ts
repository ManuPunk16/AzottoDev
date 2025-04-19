import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';

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
}

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    DatePipe
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Article[]>('/assets/articles.json').subscribe({
      next: (data) => {
        this.articles = data;
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
