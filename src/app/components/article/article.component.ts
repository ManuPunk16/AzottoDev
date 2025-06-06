import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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

// Actualiza la interfaz ArticleContentBlock
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

// Añadir esta interface para definir la estructura del artículo completo
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

  // Añadir esta propiedad
  article: Article | null = null;

  // Agrega esta propiedad para controlar si se muestran los números de línea
  showLineNumbers: boolean = true;

  // Añade esta propiedad a tu componente
  codeBlocksProcessed = false;

  // Añade estas variables a tu clase
  private touchStartX = 0;
  private touchStartY = 0;
  private isSwiping = false;

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
    if (!this.loading && this.articleContent.length > 0 && !this.codeBlocksProcessed) {
      // Usamos requestAnimationFrame para esperar que el DOM esté listo
      window.requestAnimationFrame(() => {
        // Selecciona todos los bloques de código
        const codeBlocks = document.querySelectorAll('pre code');
        if (codeBlocks.length > 0 && !this.codeBlocksProcessed) {
          codeBlocks.forEach((block: any) => {
            // Determina el lenguaje para highlighting
            const language = block.parentElement.getAttribute('data-language') || 'plain';

            // Limpia y añade la clase correcta
            const langClass = `language-${language}`;
            block.className = block.className.replace(/language-\w+/g, '');
            block.className = `${block.className} ${langClass}`.trim();

            // Aplica el resaltado de Prism
            Prism.highlightElement(block);
          });

          this.codeBlocksProcessed = true;
          this.cdr.detectChanges();
        }
      });

      // Fix para iOS
      this.fixCodeBlocksForIOS();
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

    // Limpiamos caracteres invisibles
    code = code.replace(/\uFEFF/g, '');

    // Dividir en líneas preservando líneas vacías
    const lines = code.split('\n');

    // Eliminar última línea si está vacía (común en los editores de código)
    if (lines[lines.length - 1].trim() === '') {
      return lines.slice(0, -1);
    }

    return lines;
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

  // Añade estos métodos
  preventClickCapture(event: MouseEvent) {
    // Solo detener la propagación para clicks específicos, no para todos
    if (event.target === event.currentTarget) {
      event.stopPropagation();
    }
  }

  // Mejorar los métodos de manejo de eventos táctiles
  handleTouchStart(event: TouchEvent) {
    // Registramos la posición, pero IMPORTANTE: no detener la propagación
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event: TouchEvent) {
    // Si es scrolling horizontal dentro del código, prevenir navegación lateral
    if (Math.abs(event.touches[0].clientX - this.touchStartX) > 10) {
      event.stopPropagation();
    }
    // No retornar nada, permitir comportamiento por defecto
  }

  handleTouchEnd(event: TouchEvent) {
    // Crítico: NO detener la propagación aquí
    // Solo limpiar variables
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  // Añadir este método para hacer que los bloques de código sean más amigables con iOS
  fixCodeBlocksForIOS() {
    // Detectar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // Aplica fix específico para iOS después del render
      setTimeout(() => {
        const codeBlocks = document.querySelectorAll('.code-body pre');
        codeBlocks.forEach(block => {
          // Hacer que el bloque tenga un z-index negativo
          (block as HTMLElement).style.zIndex = '1';

          // Forzar iOS a tratar los bloques de código como capas separadas
          (block as HTMLElement).style.transform = 'translateZ(0)';
          (block as HTMLElement).style.webkitTransform = 'translateZ(0)';

          // Evitar que capture eventos
          block.parentElement?.addEventListener('touchstart', e => {
            e.stopPropagation();
          }, { passive: true });
        });

        // Hacer que los enlaces en el artículo sean prioritarios
        const links = document.querySelectorAll('.prose a, nav a, header a');
        links.forEach(link => {
          (link as HTMLElement).style.position = 'relative';
          (link as HTMLElement).style.zIndex = '100';
        });
      }, 500);
    }
  }
}
