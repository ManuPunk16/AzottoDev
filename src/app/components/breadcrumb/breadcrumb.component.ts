import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../../services/breadcrumb.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb-nav">
      <div class="container mx-auto px-4">
        <ol class="flex items-center space-x-1 text-sm font-medium">
          @for (breadcrumb of breadcrumbs; track breadcrumb.url; let isLast = $last) {
            <li class="flex items-center">
              @if (!breadcrumb.isActive) {
                <a 
                  [routerLink]="breadcrumb.url"
                  class="breadcrumb-link
                         px-3 py-2 rounded-lg
                         transition-all duration-300 ease-out
                         hover:scale-[1.02] hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         active:scale-[0.98] active:translate-y-0">
                  {{ breadcrumb.label }}
                </a>
              } @else {
                <span class="breadcrumb-current
                           px-3 py-2 rounded-lg
                           font-semibold relative">
                  {{ breadcrumb.label }}
                </span>
              }
              
              @if (!isLast) {
                <svg class="breadcrumb-separator
                          mx-3 w-4 h-4 flex-shrink-0
                          transition-colors duration-300" 
                     fill="currentColor" 
                     viewBox="0 0 20 20" 
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clip-rule="evenodd">
                  </path>
                </svg>
              }
            </li>
          }
        </ol>
      </div>
    </nav>
  `,
  styles: [`
    /* ================================
       BREADCRUMB COMPONENT - TAILWIND V4 COMPATIBLE
       ================================ */
    
    .breadcrumb-nav {
      /* ✅ CORREGIDO: No usar @apply para clases que requieren referencia */
      position: sticky;
      top: 0;
      z-index: 40;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--secondary-300);
      
      /* Variables CSS del tema para colores */
      background-color: var(--background-primary);
      
      /* Glassmorphism effect */
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(255, 255, 255, 0.9);
      
      /* Transición usando la curva del tema */
      transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      
      /* Sombra sutil */
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
                  0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    /* Adaptación para tema oscuro usando :host-context */
    :host-context([data-theme="dark"]) .breadcrumb-nav {
      background: rgba(26, 26, 26, 0.9);
      border-color: var(--secondary-600);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 
                  0 1px 2px 0 rgba(0, 0, 0, 0.2);
    }
    
    /* Enlaces de breadcrumb - combinando Tailwind + variables CSS */
    .breadcrumb-link {
      /* Color usando variables del tema */
      color: var(--accent-500);
      
      /* Hover y focus states */
      &:hover {
        color: var(--accent-600);
        background-color: var(--secondary-100);
      }
      
      &:focus {
        --tw-ring-color: var(--accent-500);
        --tw-ring-offset-color: var(--background-primary);
        background-color: var(--secondary-100);
      }
      
      &:active {
        background-color: var(--secondary-200);
      }
      
      /* Efecto shimmer en hover */
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(139, 92, 246, 0.1), 
          transparent);
        transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      &:hover::before {
        left: 100%;
      }
    }
    
    /* Elemento actual (activo) */
    .breadcrumb-current {
      color: var(--text-primary);
      background-color: var(--secondary-100);
      
      /* Indicador visual de elemento activo */
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: linear-gradient(to bottom, 
          var(--accent-500), 
          var(--accent-600));
        border-radius: 0 2px 2px 0;
      }
      
      /* Efecto de pulso sutil */
      animation: breadcrumbPulse 3s ease-in-out infinite;
    }
    
    /* Separador entre elementos */
    .breadcrumb-separator {
      color: var(--secondary-500);
      
      /* Animación sutil en hover del contenedor padre */
      .breadcrumb-link:hover + li &,
      li:hover & {
        color: var(--accent-500);
        transform: translateX(2px);
      }
    }
    
    /* ================================
       RESPONSIVE DESIGN
       ================================ */
    
    @media (max-width: 640px) {
      .breadcrumb-nav {
        padding: 0.5rem 0;
      }
      
      .breadcrumb-link,
      .breadcrumb-current {
        font-size: 0.75rem;
        padding: 0.5rem 0.25rem;
      }
      
      .breadcrumb-separator {
        margin: 0 0.5rem;
        width: 0.75rem;
        height: 0.75rem;
      }
      
      /* Truncar breadcrumbs en móvil si son muy largos */
      ol {
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        
        &::-webkit-scrollbar {
          display: none;
        }
      }
      
      /* Ocultar elementos intermedios en pantallas muy pequeñas */
      @media (max-width: 480px) {
        li:not(:first-child):not(:last-child):not(:nth-last-child(2)) {
          display: none;
        }
        
        /* Mostrar indicador de elementos ocultos */
        li:nth-child(2)::after {
          content: '...';
          color: var(--secondary-500);
          margin: 0 0.5rem;
          font-weight: bold;
        }
      }
    }
    
    /* ================================
       ANIMACIONES PERSONALIZADAS
       ================================ */
    
    @keyframes breadcrumbPulse {
      0%, 100% {
        background-color: var(--secondary-100);
      }
      50% {
        background-color: var(--secondary-150, var(--secondary-200));
      }
    }
    
    /* Animación de entrada */
    ol {
      animation: fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* ================================
       MEJORAS DE ACCESIBILIDAD
       ================================ */
    
    /* Respetar preferencias de movimiento reducido */
    @media (prefers-reduced-motion: reduce) {
      .breadcrumb-link,
      .breadcrumb-current,
      .breadcrumb-separator,
      ol {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    }
    
    /* Estados de focus mejorados para accesibilidad */
    .breadcrumb-link:focus-visible {
      outline: 2px solid var(--accent-500);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    }
    
    /* ================================
       MEJORAS VISUALES AVANZADAS
       ================================ */
    
    /* Efecto hover en todo el contenedor */
    .breadcrumb-nav:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                  0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    :host-context([data-theme="dark"]) .breadcrumb-nav:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
                  0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }
    
    /* Integración con sistema de categorías del tema */
    .breadcrumb-link[data-category="web"] {
      &:hover {
        background-color: var(--category-web-bg);
        color: var(--category-web-text);
      }
    }
    
    .breadcrumb-link[data-category="frontend"] {
      &:hover {
        background-color: var(--category-frontend-bg);
        color: var(--category-frontend-text);
      }
    }
    
    .breadcrumb-link[data-category="fullstack"] {
      &:hover {
        background-color: var(--category-fullstack-bg);
        color: var(--category-fullstack-text);
      }
    }
    
    .breadcrumb-link[data-category="backend"] {
      &:hover {
        background-color: var(--category-backend-bg);
        color: var(--category-backend-text);
      }
    }
    
    /* ================================
       INTEGRACIÓN CON VARIABLES GLOBALES
       ================================ */
    
    /* Usar las transiciones globales del tema */
    .breadcrumb-link,
    .breadcrumb-current,
    .breadcrumb-separator {
      transition: background-color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  border-color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
  `]
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private destroy$ = new Subject<void>();

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.getBreadcrumbs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
        // console.log('🍞 Breadcrumbs actualizados:', breadcrumbs);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}