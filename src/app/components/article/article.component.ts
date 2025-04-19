import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { NgIf, DatePipe, NgFor } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MetadataService } from '../../services/metadata.service';

interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  featured?: boolean;
  excerpt?: string;
}

interface ArticleContentBlock {
  type: string;
  level?: number;
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
  url?: string;
  language?: string;
  code?: string;
}

interface ArticleData {
  metadata: ArticleMetadata;
  content: ArticleContentBlock[];
}

@Component({
  selector: 'app-article',
  imports: [
    MarkdownModule,
    NgIf,
    DatePipe,
    NgFor
  ],
  standalone: true,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  articleSlug: string | null = '';
  articleContent: ArticleContentBlock[] = [];
  articleMetadata: ArticleMetadata | null = null;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private metadataService: MetadataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.articleSlug = this.route.snapshot.paramMap.get('slug');
    if (this.articleSlug) {
      // Primero cargamos los metadatos del artículo desde el JSON principal
      this.http.get<any[]>('/assets/articles.json').subscribe({
        next: (articles) => {
          const article = articles.find(a => a.slug === this.articleSlug);
          if (article) {
            // Guardamos los metadatos básicos del artículo
            this.articleMetadata = article;

            // Cargamos el contenido completo del artículo desde su archivo JSON individual
            this.loadArticleContent();
          } else {
            this.error = true;
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error cargando metadatos del artículo', err);
          this.error = true;
          this.loading = false;
        }
      });
    }
  }

  loadArticleContent(): void {
    this.http
      .get<ArticleData>(`/assets/articles/${this.articleSlug}.json`)
      .subscribe({
        next: (data) => {
          // Actualizamos los metadatos con información más detallada si existe
          if (data.metadata) {
            this.articleMetadata = data.metadata;
            this.updateMetadata(this.articleMetadata);
          }

          // Guardamos el contenido del artículo
          this.articleContent = data.content || [];

          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando contenido del artículo', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  updateMetadata(metadata: any) {
    this.metadataService.updateMetadata(metadata);
  }

  // Nueva función para procesar Markdown básico
  renderMarkdown(text: string): SafeHtml {
    if (!text) return '';

    // Convertir **texto** a <strong>texto</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--primary-900)]">$1</strong>');

    // Convertir *texto* a <em>texto</em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-[var(--text-primary)]">$1</em>');

    // Convertir `código` a <code>código</code>
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-[var(--secondary-100)] text-[var(--primary-700)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Enlaces (formato [texto](url))
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--primary-500)] hover:text-[var(--primary-700)] underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Sanitizar el HTML resultante
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
