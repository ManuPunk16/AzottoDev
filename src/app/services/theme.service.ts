import {
  Injectable,
  Renderer2,
  RendererFactory2,
  DOCUMENT,
} from '@angular/core';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Verificar tema guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Aplicar tema inmediatamente sin transición
    this.applyThemeImmediate(this.currentTheme);

    // Habilitar transiciones después de la carga inicial
    setTimeout(() => {
      this.renderer.removeClass(this.document.documentElement, 'no-transition');
    }, 50);
  }

  private applyThemeImmediate(theme: 'light' | 'dark'): void {
    // Deshabilitar transiciones temporalmente
    this.renderer.addClass(this.document.documentElement, 'no-transition');

    if (theme === 'dark') {
      this.renderer.setAttribute(
        this.document.documentElement,
        'data-theme',
        'dark'
      );
    } else {
      this.renderer.removeAttribute(
        this.document.documentElement,
        'data-theme'
      );
    }

    // Re-habilitar transiciones
    requestAnimationFrame(() => {
      this.renderer.removeClass(this.document.documentElement, 'no-transition');
    });
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

    // Optimización: usar requestAnimationFrame para sincronizar con el repaint
    requestAnimationFrame(() => {
      this.applyTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    });
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      this.renderer.setAttribute(
        this.document.documentElement,
        'data-theme',
        'dark'
      );
    } else {
      this.renderer.removeAttribute(
        this.document.documentElement,
        'data-theme'
      );
    }
  }

  getTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }
}
