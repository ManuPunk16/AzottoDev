import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import matter from 'gray-matter';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-article',
  imports: [
    MarkdownModule
  ],
  standalone: true,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  articleSlug: string | null = '';
  articleContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private metadataService: MetadataService
  ) {}

  ngOnInit(): void {
    this.articleSlug = this.route.snapshot.paramMap.get('slug');
    if (this.articleSlug) {
      this.http
        .get(`/articles/${this.articleSlug}.md`, { responseType: 'text' })
        .subscribe((data) => {
          const parsedArticle = matter(data);
          this.articleContent = parsedArticle.content;
          this.updateMetadata(parsedArticle.data);
        });
    }
  }

  updateMetadata(metadata: any) {
    this.metadataService.updateMetadata(metadata);
  }
}
