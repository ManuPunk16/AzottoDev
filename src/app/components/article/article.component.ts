import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { NgIf, DatePipe, NgFor, NgClass } from '@angular/common';
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

// Añadir esta interface para definir la estructura del artículo completo
interface Article {
  metadata: ArticleMetadata;
  content: ArticleContentBlock[];
}

@Component({
  selector: 'app-article',
  imports: [
    MarkdownModule,
    NgIf,
    DatePipe,
    NgFor,
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

  // Añadir esta propiedad
  article: Article | null = null;

  // Agrega esta propiedad para controlar si se muestran los números de línea
  showLineNumbers: boolean = true;

  // Añade esta propiedad a tu componente
  codeBlocksProcessed = false;

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

          // Creamos el objeto article que combina metadata y content
          this.article = {
            metadata: this.articleMetadata!,
            content: this.articleContent
          };

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

  // Añade esta función en tu clase ArticleComponent
  copyCode(code: string): void {
    navigator.clipboard.writeText(code)
      .then(() => {
        // Opcional: mostrar feedback de copiado exitoso
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
    if (!this.loading && !this.codeBlocksProcessed && this.articleContent.length > 0) {
      setTimeout(() => {
        document.querySelectorAll('pre code').forEach((block: any) => {
          // Asegurar que la clase del lenguaje está aplicada correctamente
          const language = block.parentElement.getAttribute('data-language') || 'plain';
          block.className = `language-${language}`;

          // Aplicar resaltado
          Prism.highlightElement(block);
        });

        this.codeBlocksProcessed = true;
        this.cdr.detectChanges();
      }, 100);
    }
  }

  // Función para obtener la clase CSS para el lenguaje
  getLanguageClass(language: string | undefined): string {
    if (!language) return 'language-plain';
    return `language-${language}`;
  }

  // Función para dividir el código en líneas para mostrar números de línea
  getCodeLines(code: string | undefined): string[] {
    if (!code) return [];

    // Eliminar caracteres invisibles o de control
    code = code.replace(/\uFEFF/g, '');

    // Dividir por saltos de línea
    const lines = code.split('\n');

    // Tratar líneas vacías al final que pueden causar desalineación
    let result = [...lines];

    // Si la última línea está vacía, la eliminamos para evitar números de línea extra
    if (result.length > 0 && !result[result.length - 1].trim()) {
      result = result.slice(0, -1);
    }

    return result.length > 0 ? result : [''];
  }

  // Función para resaltar líneas específicas en el código
  // Esto asume que puedes marcar líneas para resaltar usando un comentario especial
  // como // highlight-line o un rango como // highlight-start y // highlight-end
  processLineHighlighting(code: string): SafeHtml {
    if (!code) return '';

    // No escapamos HTML aquí para permitir que Prism aplique sus propios estilos
    // Solo limpiamos caracteres invisibles
    code = code.replace(/\uFEFF/g, '');

    // Dejamos que Prism maneje el resaltado de sintaxis
    return this.sanitizer.bypassSecurityTrustHtml(code);
  }
}
