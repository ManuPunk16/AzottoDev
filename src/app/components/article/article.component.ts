import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { DatePipe, NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MetadataService } from '../../services/metadata.service';
import Swal from 'sweetalert2';
import * as Prism from 'prismjs';

// Importa los lenguajes que necesitas para tu blog
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

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
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'link' | 'code';
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

interface Article {
  metadata: ArticleMetadata;
  content: ArticleContentBlock[];
}

@Component({
  selector: 'app-article',
  imports: [
    MarkdownModule,
    DatePipe,
    NgClass
  ],
  standalone: true,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, AfterViewChecked {
  articleSlug: string | null = '';
  articleContent: ArticleContentBlock[] = [];
  articleMetadata: ArticleMetadata | null = null;
  loading: boolean = true;
  error: boolean = false;
  article: Article | null = null;
  showLineNumbers: boolean = true;
  codeBlocksProcessed = false;

  // ✅ Variables simplificadas para touch
  private isProcessingTouch = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private metadataService: MetadataService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.articleSlug = this.route.snapshot.paramMap.get('slug');
    if (this.articleSlug) {
      this.http.get<any[]>('/assets/articles.json').subscribe({
        next: (articles) => {
          const article = articles.find(a => a.slug === this.articleSlug);
          if (article) {
            this.articleMetadata = article;
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
          if (data.metadata) {
            this.articleMetadata = data.metadata;
            this.updateMetadata(this.articleMetadata);
          }

          this.articleContent = data.content || [];
          this.article = {
            metadata: this.articleMetadata!,
            content: this.articleContent
          };

          this.loading = false;
          
          // ✅ Procesar código después de un pequeño delay
          setTimeout(() => {
            this.processCodeBlocks();
          }, 100);
        },
        error: (err) => {
          console.error('Error cargando contenido del artículo', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  updateMetadata(metadata: any) {
    this.metadataService.updateArticleMetadata(metadata);
  }

  renderMarkdown(text: string): SafeHtml {
    if (!text) return '';

    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--primary-900)]">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-[var(--text-primary)]">$1</em>');
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-[var(--secondary-100)] text-[var(--primary-700)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--primary-500)] hover:text-[var(--primary-700)] underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code)
      .then(() => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: 'success',
          title: 'Código copiado al portapapeles'
        });
      })
      .catch(err => {
        console.error('Error al copiar código', err);
      });
  }

  ngAfterViewChecked() {
    // ✅ Procesamiento más controlado
    if (!this.loading && this.articleContent.length > 0 && !this.codeBlocksProcessed) {
      this.processCodeBlocks();
    }
  }

  // ✅ Método mejorado para procesar bloques de código
  private processCodeBlocks(): void {
    if (this.codeBlocksProcessed) return;

    requestAnimationFrame(() => {
      const codeBlocks = document.querySelectorAll('pre code');
      if (codeBlocks.length > 0) {
        codeBlocks.forEach((block: any) => {
          const language = block.parentElement.getAttribute('data-language') || 'plain';
          const langClass = `language-${language}`;
          block.className = block.className.replace(/language-\w+/g, '');
          block.className = `${block.className} ${langClass}`.trim();
          
          try {
            Prism.highlightElement(block);
          } catch (error) {
            console.warn('Error highlighting code block:', error);
          }
        });

        this.codeBlocksProcessed = true;
        this.cdr.detectChanges();
        
        // ✅ Configurar eventos touch de manera segura
        this.setupSafeTouchHandling();
      }
    });
  }

  // ✅ Configuración segura de eventos touch
  private setupSafeTouchHandling(): void {
    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      setTimeout(() => {
        // ✅ Solo configurar lo esencial
        this.ensureLinkAccessibility();
      }, 100); // Reducido de 200ms a 100ms
    }
  }

  // ✅ Asegurar accesibilidad de enlaces - SIMPLIFICADO
  private ensureLinkAccessibility(): void {
    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach((link: any) => {
      // ✅ Solo las propiedades esenciales
      link.style.touchAction = 'manipulation';
      link.style.position = 'relative';
      link.style.zIndex = '100';
      
      // ✅ Solo si realmente es necesario el área de toque
      if (link.offsetHeight < 44) {
        link.style.minHeight = '44px';
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
      }
    });
  }

  // ✅ Métodos simplificados para manejo de eventos
  getLanguageClass(language: string | undefined): string {
    if (!language) return 'language-plain';
    return `language-${language}`;
  }

  getCodeLines(code: string | undefined): string[] {
    if (!code) return [];
    code = code.replace(/\uFEFF/g, '');
    const lines = code.split('\n');
    if (lines[lines.length - 1].trim() === '') {
      return lines.slice(0, -1);
    }
    return lines;
  }

  processLineHighlighting(code: string): SafeHtml {
    if (!code) return '';
    code = code.replace(/\uFEFF/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(code);
  }

  // ✅ Método simplificado para prevenir captura de clicks
  preventClickCapture(event: MouseEvent): void {
    // Solo prevenir propagación si realmente es necesario
    if (this.isProcessingTouch) {
      event.stopPropagation();
    }
  }
}
