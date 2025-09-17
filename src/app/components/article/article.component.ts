import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
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
  slug?: string;
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
  standalone: true,
  imports: [CommonModule, MarkdownModule, DatePipe, NgClass],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  loading = true;
  error = false;
  showLineNumbers = true;
  codeBlocksProcessed = false;
  
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private metadataService: MetadataService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const articleSlug = params['slug'];
      // console.log(articleSlug);
      if (articleSlug) {
        this.resetComponent();
        this.loadArticle(articleSlug);
        this.scrollToTop();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.metadataService.clearStructuredData();
  }

  private resetComponent(): void {
    this.loading = true;
    this.error = false;
    this.article = null;
    this.codeBlocksProcessed = false;
  }

  private scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private loadArticle(slug: string) {
    this.loading = true;
    this.error = false;

    // Cargar artículo específico
    this.http.get<ArticleData>(`/assets/articles/${slug}.json`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        if (data.metadata) {
          // console.log(data.metadata);
          const articleForSEO = {
            ...data.metadata,
            slug: slug
          };
          
          this.article = {
            metadata: articleForSEO,
            content: data.content || []
          };
          
          this.metadataService.updateArticleMetadata(articleForSEO);
          this.loading = false;
          
          // Procesar código después de un delay
          setTimeout(() => {
            this.processCodeBlocks();
          }, 100);
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
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

  private processCodeBlocks(): void {
    if (this.codeBlocksProcessed || !this.isBrowser) return;

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
        this.setupSafeTouchHandling();
      }
    });
  }

  private setupSafeTouchHandling(): void {
    if (!this.isBrowser) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      setTimeout(() => {
        this.ensureLinkAccessibility();
      }, 100);
    }
  }

  private ensureLinkAccessibility(): void {
    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach((link: any) => {
      link.style.touchAction = 'manipulation';
      link.style.position = 'relative';
      link.style.zIndex = '100';
      
      if (link.offsetHeight < 44) {
        link.style.minHeight = '44px';
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
      }
    });
  }

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

  goBack() {
    this.router.navigate(['/articles']);
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    console.warn('Error cargando imagen:', event.target.src);
  }

  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }
}
