import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

interface Article {
  slug: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    RouterLink,
    NgFor
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Article[]>('/articles.json').subscribe((data) => {
      this.articles = data;
    });
  }
}
