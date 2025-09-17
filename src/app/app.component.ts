import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
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
import { MetadataService } from './services/metadata.service';
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface SocialLink {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
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
export class AppComponent implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly metadataService = inject(MetadataService);
  
  // ✅ AGREGADO: Subscription para cleanup
  private routerSubscription?: Subscription;

  // Estado del menú móvil
  isMobileMenuOpen = false;

  // Enlaces sociales actualizados
  readonly socialLinks: readonly SocialLink[] = [
    { name: 'GitHub', url: 'https://github.com/ManuPunk16', icon: 'github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/azotodev/', icon: 'linkedin' },
    { name: 'X (Twitter)', url: 'https://x.com/azotodev', icon: 'twitter' },
    { name: 'Email', url: 'mailto:azzoto@icloud.com', icon: 'email' },
  ] as const;

  readonly quickLinks: readonly QuickLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Artículos', href: '/articles' },
    { label: 'GitHub', href: 'https://github.com/ManuPunk16' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/azotodev/' },
  ] as const;

  readonly portfolioStats: readonly Stat[] = [
    { label: 'Proyectos', value: '15+' },
    { label: 'Commits', value: '2,500+' },
    { label: 'Líneas de Código', value: '50K+' },
    { label: 'Años de Experiencia', value: '5+' },
  ] as const;

  // Información del portfolio
  readonly portfolioInfo = {
    version: '2.1.0',
    angularVersion: '20.1',
    author: 'Luis Hernández (AzotoDev)',
    email: 'azzoto@icloud.com',
    github: 'https://github.com/ManuPunk16',
    twitter: 'https://x.com/azotodev',
    linkedin: 'https://www.linkedin.com/in/azotodev/',
    domain: 'https://azotodev.com'
  } as const;

  readonly lastUpdate = new Date();
  readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.setupKeyboardNavigation();
    this.setupAnalytics();
    // ✅ AGREGADO: Setup de rutas SEO
    this.setupRouterSEO();
  }

  // ✅ AGREGADO: Cleanup
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  // ✅ AGREGADO: Setup automático de SEO en cada ruta
  private setupRouterSEO(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Pequeño delay para asegurar que el componente esté listo
        setTimeout(() => {
          this.updateSEOForRoute(event.url);
        }, 100);
      });
    
    // Ejecutar inmediatamente para la ruta inicial
    setTimeout(() => {
      this.updateSEOForRoute(this.router.url);
    }, 100);
  }

  // ✅ AGREGADO: Lógica SEO por ruta
  private updateSEOForRoute(url: string): void {
    if (url === '/' || url === '/home') {
      this.metadataService.updateHomeMetadata();
    } else if (url === '/projects') {
      this.metadataService.updateProjectsMetadata();
    } else if (url === '/articles') {
      this.metadataService.updateArticlesMetadata();
    } else if (url === '/certificates') {
      this.metadataService.updateCertificatesMetadata();
    }
    // Los componentes individuales (project-detail, article, certificate-detail) 
    // manejan su propio SEO en sus respectivos ngOnInit
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

  // Métodos privados
  private toggleBodyScroll(): void {
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  private setupAnalytics(): void {
    // Configuración de analytics para Vercel
    if (typeof window !== 'undefined' && window.location.hostname === 'azotodev.com') {
      console.log('🚀 AzotoDev Portfolio iniciado');
    }
  }

  // TrackBy functions para optimización
  trackBySocialName = (index: number, social: SocialLink): string => social.name;
  trackByLinkLabel = (index: number, link: QuickLink): string => link.label;
  trackByStatLabel = (index: number, stat: Stat): string => stat.label;
}
