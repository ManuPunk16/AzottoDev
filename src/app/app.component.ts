import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ThemeService } from './services/theme.service';
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";

interface SocialLink {
  readonly name: string;
  readonly url: string;
}

interface QuickLink {
  readonly label: string;
  readonly href: string;
}

interface Stat {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    MarkdownModule,
    DatePipe,
    CommonModule,
    BreadcrumbComponent
],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in')]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'),
      ]),
      transition(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(-20px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // Inyección moderna de Angular 20
  readonly themeService = inject(ThemeService);

  // Estado del menú móvil
  isMobileMenuOpen = false;

  // Data con readonly para inmutabilidad
  readonly socialLinks: readonly SocialLink[] = [
    { name: 'GitHub', url: 'https://github.com/ManuPunk16' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/azotodev' },
    { name: 'Twitter', url: 'https://twitter.com/azotodev' },
    { name: 'Email', url: 'mailto:contacto@azottodev.com' },
  ] as const;

  readonly quickLinks: readonly QuickLink[] = [
    { label: 'Sobre mí', href: '/#about' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Artículos', href: '/articles' },
    { label: 'Contacto', href: '/#contact' },
    { label: 'CV', href: '/assets/cv-luis-hernandez.pdf' },
  ] as const;

  readonly portfolioStats: readonly Stat[] = [
    { label: 'Proyectos', value: '10+' },
    { label: 'Commits', value: '1,200+' },
    { label: 'Código', value: '20K+' },
    { label: 'Horas', value: '5,000+' },
  ] as const;

  // Portfolio metadata con readonly
  readonly portfolioVersion = '2.1.0' as const;
  readonly angularVersion = '20.0' as const;
  readonly lastUpdate = new Date();
  readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    // Configuración inicial si es necesaria
    this.setupKeyboardNavigation();
  }

  // Métodos para el menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.enableBodyScroll();
  }

  // Métodos privados con mejor encapsulación
  private toggleBodyScroll(): void {
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private setupKeyboardNavigation(): void {
    // Cerrar menú móvil con ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  // TrackBy functions para optimización de rendimiento
  trackBySocialName = (index: number, social: SocialLink): string =>
    social.name;
  trackByLinkLabel = (index: number, link: QuickLink): string => link.label;
  trackByStatLabel = (index: number, stat: Stat): string => stat.label;
}
