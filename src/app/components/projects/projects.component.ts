import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { NgClass, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  imports: [DatePipe, NgClass],
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  featuredProjects: Project[] = [];
  publicProjects: Project[] = [];
  privateProjects: Project[] = [];
  internalProjects: Project[] = [];
  loading: boolean = true;
  error: boolean = false;

  // Estado para la galería
  currentGalleryIndex = 0;
  isGalleryOpen = false;
  currentProject: Project | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<Project[]>('/assets/projects.json').subscribe({
      next: (data) => {
        this.projects = data;
        this.categorizeProjects();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  private categorizeProjects(): void {
    this.featuredProjects = this.projects.filter(project => project.featured);
    this.publicProjects = this.projects.filter(project => project.privacy === 'public');
    this.privateProjects = this.projects.filter(project => project.privacy === 'private');
    this.internalProjects = this.projects.filter(project => project.privacy === 'internal');
  }

  getImageUrl(path: string): string {
    return path.startsWith('./') ? path : `./assets/images/projects/${path}`;
  }

  getPrivacyBadgeClasses(privacy: string): string {
    const baseClasses = 'text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm';
    
    switch (privacy) {
      case 'public':
        return `${baseClasses} bg-green-500/90 text-white`;
      case 'private':
        return `${baseClasses} bg-orange-500/90 text-white`;
      case 'internal':
        return `${baseClasses} bg-blue-500/90 text-white`;
      default:
        return `${baseClasses} bg-gray-500/90 text-white`;
    }
  }

  getPrivacyIcon(privacy: string): string {
    switch (privacy) {
      case 'public': return '🌐';
      case 'private': return '🔒';
      case 'internal': return '🏢';
      default: return '📁';
    }
  }

  getStatusBadgeClasses(status: string): string {
    const baseClasses = 'text-xs px-2 py-1 rounded-full font-medium';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300`;
      case 'in-progress':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300`;
      case 'maintenance':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300`;
      case 'archived':
        return `${baseClasses} bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300`;
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'Completado',
      'in-progress': 'En Desarrollo',
      'maintenance': 'Mantenimiento',
      'archived': 'Archivado'
    };
    return statusMap[status] || status;
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'web': return '🌐';
      case 'fullstack': return '⚡';
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'mobile': return '📱';
      default: return '💼';
    }
  }

  openGallery(project: Project, startIndex: number = 0): void {
    if (!project.gallery || project.gallery.length === 0) return;
    
    this.currentProject = project;
    this.currentGalleryIndex = startIndex;
    this.isGalleryOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.currentProject = null;
    this.currentGalleryIndex = 0;
    document.body.style.overflow = 'auto';
  }

  nextImage(): void {
    if (this.currentProject && this.currentProject.gallery) {
      this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.currentProject.gallery.length;
    }
  }

  prevImage(): void {
    if (this.currentProject && this.currentProject.gallery) {
      const length = this.currentProject.gallery.length;
      this.currentGalleryIndex = (this.currentGalleryIndex - 1 + length) % length;
    }
  }

  showProjectDetails(project: Project): void {
    const privacyIcon = this.getPrivacyIcon(project.privacy);
    const statusText = this.getStatusText(project.status);
    
    // Generar badges de tecnologías
    const techBadges = project.technologies.map(tech => 
      `<span class="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-1 mb-1">${tech}</span>`
    ).join('');

    // Generar lista de características
    const featuresList = project.features.map(feature => 
      `<li class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        ${feature}
      </li>`
    ).join('');

    // Generar métricas si existen
    let metricsHtml = '';
    if (project.metrics) {
      const metrics = [];
      if (project.metrics.users) metrics.push(`<span class="text-sm"><strong>Usuarios:</strong> ${project.metrics.users}+</span>`);
      if (project.metrics.performance) metrics.push(`<span class="text-sm"><strong>Performance:</strong> ${project.metrics.performance}</span>`);
      if (project.metrics.uptime) metrics.push(`<span class="text-sm"><strong>Uptime:</strong> ${project.metrics.uptime}</span>`);
      
      if (metrics.length > 0) {
        metricsHtml = `
          <div class="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h4 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Métricas del Proyecto</h4>
            <div class="grid grid-cols-1 gap-1 text-gray-600 dark:text-gray-400">
              ${metrics.join('')}
            </div>
          </div>
        `;
      }
    }

    // Generar enlaces
    const links: string[] = [];
    if (project.demoUrl) {
      links.push(`
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Ver Demo
        </a>
      `);
    }

    if (project.repoUrl) {
      links.push(`
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Código
        </a>
      `);
    }

    const linksHtml = links.length > 0 ? `<div class="flex gap-3 mt-4">${links.join('')}</div>` : '';

    // Configurar SweetAlert2
    Swal.fire({
      title: project.title,
      html: `
        <div class="text-left space-y-4">
          <!-- Badges de estado y privacidad -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="${this.getPrivacyBadgeClasses(project.privacy)}">
              ${privacyIcon} ${project.privacy.charAt(0).toUpperCase() + project.privacy.slice(1)}
            </span>
            <span class="${this.getStatusBadgeClasses(project.status)}">
              ${statusText}
            </span>
          </div>

          <!-- Descripción -->
          <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
            ${project.longDescription || project.description}
          </div>

          <!-- Características -->
          <div>
            <h4 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Características Principales:</h4>
            <ul class="space-y-1">
              ${featuresList}
            </ul>
          </div>

          <!-- Tecnologías -->
          <div>
            <h4 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Tecnologías:</h4>
            <div class="flex flex-wrap gap-1">
              ${techBadges}
            </div>
          </div>

          <!-- Métricas -->
          ${metricsHtml}

          <!-- Información del proyecto -->
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div><strong>Fecha:</strong> ${new Date(project.date).toLocaleDateString()}</div>
            <div><strong>Equipo:</strong> ${project.team.size} persona${project.team.size > 1 ? 's' : ''}</div>
            <div><strong>Duración:</strong> ${project.team.duration}</div>
            <div><strong>Rol:</strong> ${project.team.role}</div>
          </div>

          ${linksHtml}
        </div>
      `,
      width: '800px',
      customClass: {
        popup: 'dark:bg-gray-800 dark:text-white',
        title: 'dark:text-white',
        htmlContainer: 'dark:text-gray-300'
      },
      showCloseButton: true,
      showConfirmButton: false,
      background: undefined,
      didOpen: () => {
        // Ajustar colores según el tema
        const popup = Swal.getPopup();
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
          popup?.classList.add('dark-theme-modal');
        }
      }
    });
  }
}
