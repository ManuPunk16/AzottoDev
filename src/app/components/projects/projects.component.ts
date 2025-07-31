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

  // Agregar después del método getImageUrl
  generateImagePlaceholder(project: Project, imageIndex: number = 0): string {
    const gradients = [
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-pink-400 via-red-500 to-yellow-500',
      'from-indigo-400 via-purple-500 to-pink-500',
      'from-cyan-400 via-blue-500 to-indigo-600'
    ];
    
    const gradient = gradients[imageIndex % gradients.length];
    const categoryIcon = this.getCategoryIcon(project.category);
    
    return `
      <div class="w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white relative overflow-hidden">
        <!-- Patrón de fondo sutil -->
        <div class="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
        
        <!-- Contenido del placeholder -->
        <div class="relative z-10 text-center">
          <div class="text-4xl mb-3">${categoryIcon}</div>
          <div class="text-lg font-semibold mb-1">${project.title}</div>
          <div class="text-sm opacity-80">${project.category}</div>
          <div class="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
            📸 Capturas próximamente
          </div>
        </div>
        
        <!-- Elementos decorativos -->
        <div class="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
      </div>
    `;
  }

  getImageUrlWithFallback(path: string, project: Project, imageIndex: number = 0): string {
    // Para URLs externas, verificar si la imagen existe
    if (path.startsWith('http')) {
      return `<img src="${path}" alt="Captura del proyecto" 
               class="w-full h-full object-cover" 
               onerror="this.parentElement.innerHTML='${this.generateImagePlaceholder(project, imageIndex).replace(/'/g, '&quot;')}'">`;
    }
    
    // Para rutas locales, usar el método existente
    const imageUrl = this.getImageUrl(path);
    return `<img src="${imageUrl}" alt="Captura del proyecto" 
             class="w-full h-full object-cover" 
             onerror="this.parentElement.innerHTML='${this.generateImagePlaceholder(project, imageIndex).replace(/'/g, '&quot;')}'">`;
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
    if (!project.gallery || project.gallery.length === 0) {
      // Mostrar mensaje amigable
      Swal.fire({
        title: 'Galería no disponible',
        html: `
          <div class="text-center py-8">
            ${this.generateMainImagePlaceholder(project)}
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              Las capturas de este proyecto estarán disponibles próximamente.
            </p>
          </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: '500px'
      });
      return;
    }
    
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
    // Crear contenedor principal usando DOM
    const container = this.createModalContainer();
    
    // Crear secciones
    const badgesSection = this.createBadgesSection(project);
    const descriptionSection = this.createDescriptionSection(project);
    const featuresSection = this.createFeaturesSection(project);
    const technologiesSection = this.createTechnologiesSection(project);
    const metricsSection = this.createMetricsSection(project);
    const gallerySection = this.createGallerySection(project);
    const projectInfoSection = this.createProjectInfoSection(project);
    const linksSection = this.createLinksSection(project);
    
    // Ensamblar todo
    container.appendChild(badgesSection);
    container.appendChild(descriptionSection);
    container.appendChild(featuresSection);
    container.appendChild(technologiesSection);
    if (metricsSection) container.appendChild(metricsSection);
    if (gallerySection) container.appendChild(gallerySection);
    container.appendChild(projectInfoSection);
    if (linksSection) container.appendChild(linksSection);
    
    // Configurar SweetAlert2
    Swal.fire({
      title: project.title,
      html: container,
      width: '800px',
      customClass: {
        popup: 'swal2-custom-popup',
        title: 'swal2-custom-title text-2xl font-bold',
        htmlContainer: 'swal2-custom-html p-0'
      },
      showCloseButton: true,
      showConfirmButton: false,
      didOpen: () => {
        this.setupGalleryEventListeners(project);
        this.adjustThemeColors();
      }
    });
  }

  onImageError(event: any, project: Project): void {
    const imgElement = event.target;
    const container = imgElement.parentElement;
    
    // Crear placeholder más sofisticado
    container.innerHTML = this.generateMainImagePlaceholder(project);
  }

  generateMainImagePlaceholder(project: Project): string {
    const gradients = [
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-pink-400 via-red-500 to-yellow-500',
      'from-indigo-400 via-purple-500 to-pink-500'
    ];
    
    const gradient = gradients[project.title.length % gradients.length];
    const categoryIcon = this.getCategoryIcon(project.category);
    
    return `
      <div class="w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
        <!-- Patrón geométrico de fondo -->
        <div class="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="grid-${project.id}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-${project.id})"/>
          </svg>
        </div>
        
        <!-- Elementos decorativos flotantes -->
        <div class="absolute top-8 right-8 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
        <div class="absolute bottom-8 left-8 w-12 h-12 border border-white/40 rounded-full"></div>
        <div class="absolute top-1/2 left-8 w-6 h-6 bg-white/20 rounded-full"></div>
        
        <!-- Contenido principal -->
        <div class="relative z-10 text-center px-4">
          <div class="text-6xl mb-4 animate-bounce">${categoryIcon}</div>
          <div class="text-xl font-bold mb-2 text-shadow">${project.title}</div>
          <div class="text-sm opacity-90 mb-4">${project.category} • ${project.status}</div>
          
          <!-- Badge estado -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/25 rounded-full text-sm backdrop-blur-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
            </svg>
            Capturas próximamente
          </div>
        </div>
        
        <!-- Gradient overlay para mejor legibilidad -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20"></div>
      </div>
    `;
  }

  private createModalContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'text-left space-y-6 max-w-full';
    return container;
  }

  private createBadgesSection(project: Project): HTMLElement {
    const section = document.createElement('div');
    section.className = 'flex flex-wrap gap-2 mb-4';

    // Badge de privacidad
    const privacyBadge = document.createElement('span');
    privacyBadge.className = this.getPrivacyBadgeClasses(project.privacy);
    privacyBadge.innerHTML = `${this.getPrivacyIcon(project.privacy)} ${project.privacy.charAt(0).toUpperCase() + project.privacy.slice(1)}`;

    // Badge de estado
    const statusBadge = document.createElement('span');
    statusBadge.className = this.getStatusBadgeClasses(project.status);
    statusBadge.textContent = this.getStatusText(project.status);

    section.appendChild(privacyBadge);
    section.appendChild(statusBadge);
    return section;
  }

  private createDescriptionSection(project: Project): HTMLElement {
    const section = document.createElement('div');
    section.className = 'prose prose-sm max-w-none';
    
    const description = document.createElement('p');
    // Usar colores CSS variables que respetan el tema
    description.className = 'leading-relaxed text-sm text-gray-800 dark:text-gray-200';
    description.style.color = 'var(--text-primary)'; // Forzar el color correcto
    description.textContent = project.longDescription || project.description;
    
    section.appendChild(description);
    return section;
  }

  private createFeaturesSection(project: Project): HTMLElement {
    const section = document.createElement('div');
    section.className = 'space-y-3';

    const title = document.createElement('h4');
    title.className = 'font-semibold flex items-center gap-2';
    title.style.color = 'var(--primary-900)'; // Color principal para títulos
    title.innerHTML = `
      <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Características Principales
    `;

    const list = document.createElement('ul');
    list.className = 'space-y-2';

    project.features.forEach(feature => {
      const listItem = document.createElement('li');
      listItem.className = 'flex items-start gap-3 text-sm';
      listItem.innerHTML = `
        <svg class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span style="color: var(--text-primary)">${feature}</span>
      `;
      list.appendChild(listItem);
    });

    section.appendChild(title);
    section.appendChild(list);
    return section;
  }

  private createTechnologiesSection(project: Project): HTMLElement {
    const section = document.createElement('div');
    section.className = 'space-y-3';

    const title = document.createElement('h4');
    title.className = 'font-semibold flex items-center gap-2';
    title.style.color = 'var(--primary-900)';
    title.innerHTML = `
      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
      Tecnologías
    `;

    const container = document.createElement('div');
    container.className = 'flex flex-wrap gap-2';

    project.technologies.forEach(tech => {
      const badge = document.createElement('span');
      // Usar colores CSS variables para badges
      badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border';
      badge.style.backgroundColor = 'var(--secondary-100)';
      badge.style.color = 'var(--primary-800)';
      badge.style.borderColor = 'var(--secondary-300)';
      badge.textContent = tech;
      container.appendChild(badge);
    });

    section.appendChild(title);
    section.appendChild(container);
    return section;
  }

  private createMetricsSection(project: Project): HTMLElement | null {
    if (!project.metrics) return null;

    const section = document.createElement('div');
    section.className = 'space-y-3';

    const title = document.createElement('h4');
    title.className = 'font-semibold flex items-center gap-2';
    title.style.color = 'var(--primary-900)';
    title.innerHTML = `
      <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
      Métricas del Proyecto
    `;

    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'rounded-lg p-4 border';
    metricsContainer.style.backgroundColor = 'var(--secondary-100)';
    metricsContainer.style.borderColor = 'var(--secondary-300)';

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';

    // Crear métricas con los colores correctos
    if (project.metrics.users) {
      const userMetric = this.createMetricCard('👥', 'Usuarios', `${project.metrics.users}+`, 'text-green-600');
      grid.appendChild(userMetric);
    }

    if (project.metrics.performance) {
      const perfMetric = this.createMetricCard('⚡', 'Performance', project.metrics.performance, 'text-blue-600');
      grid.appendChild(perfMetric);
    }

    if (project.metrics.uptime) {
      const uptimeMetric = this.createMetricCard('🔥', 'Uptime', project.metrics.uptime, 'text-purple-600');
      grid.appendChild(uptimeMetric);
    }

    metricsContainer.appendChild(grid);
    section.appendChild(title);
    section.appendChild(metricsContainer);
    return section;
  }

  private createMetricCard(icon: string, label: string, value: string, colorClass: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'text-center p-3 rounded-lg shadow-sm border';
    card.style.backgroundColor = 'var(--background-primary)';
    card.style.borderColor = 'var(--secondary-300)';
    
    card.innerHTML = `
      <div class="text-2xl mb-1">${icon}</div>
      <div class="text-lg font-bold ${colorClass}">${value}</div>
      <div class="text-xs uppercase tracking-wide" style="color: var(--text-secondary)">${label}</div>
    `;
    return card;
  }

  private createGallerySection(project: Project): HTMLElement | null {
    if (!project.hasScreenshots || !project.gallery || project.gallery.length === 0) {
      return null;
    }

    const section = document.createElement('div');
    section.className = 'space-y-4';

    const title = document.createElement('h4');
    title.className = 'font-semibold flex items-center gap-2';
    title.style.color = 'var(--primary-900)';
    title.innerHTML = `
      <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
      </svg>
      Capturas del Proyecto <span class="text-sm font-normal" style="color: var(--text-secondary)">(${project.gallery.length})</span>
    `;

    const imageGrid = document.createElement('div');
    imageGrid.className = 'grid grid-cols-3 gap-3';

    project.gallery.slice(0, 3).forEach((image, index) => {
      const imageContainer = this.createImageThumbnail(image, project, index);
      imageGrid.appendChild(imageContainer);
    });

    section.appendChild(title);
    section.appendChild(imageGrid);

    if (project.gallery.length > 3) {
      const viewAllButton = document.createElement('button');
      viewAllButton.id = 'view-all-gallery';
      viewAllButton.className = 'w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border';
      viewAllButton.style.backgroundColor = 'var(--secondary-100)';
      viewAllButton.style.color = 'var(--primary-800)';
      viewAllButton.style.borderColor = 'var(--secondary-300)';
      viewAllButton.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Ver todas las capturas (${project.gallery.length})
      `;
      
      // Agregar hover effect
      viewAllButton.addEventListener('mouseenter', () => {
        viewAllButton.style.backgroundColor = 'var(--secondary-200)';
      });
      viewAllButton.addEventListener('mouseleave', () => {
        viewAllButton.style.backgroundColor = 'var(--secondary-100)';
      });
      
      section.appendChild(viewAllButton);
    }

    return section;
  }

  private createImageThumbnail(image: any, project: Project, index: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'relative group cursor-pointer gallery-thumbnail overflow-hidden rounded-lg aspect-video bg-gray-100 dark:bg-gray-800';
    container.dataset['index'] = index.toString();

    const img = document.createElement('img');
    img.src = this.getImageUrl(image.url);
    img.alt = image.alt || `Captura ${index + 1}`;
    img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';

    // Fallback para imágenes que fallan
    img.onerror = () => {
      container.innerHTML = '';
      const placeholder = this.createImagePlaceholder(project, index);
      container.appendChild(placeholder);
    };

    // Overlay con icono de zoom
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-lg';
    overlay.innerHTML = `
      <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    `;

    container.appendChild(img);
    container.appendChild(overlay);
    return container;
  }

  private createImagePlaceholder(project: Project, index: number): HTMLElement {
    const gradients = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3']
    ];

    const [start, end] = gradients[index % gradients.length];
    const categoryIcon = this.getCategoryIcon(project.category);

    const placeholder = document.createElement('div');
    placeholder.className = 'w-full h-full flex flex-col items-center justify-center text-white relative overflow-hidden rounded-lg';
    placeholder.style.background = `linear-gradient(135deg, ${start}, ${end})`;

    placeholder.innerHTML = `
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 text-center px-2">
        <div class="text-xl mb-1">${categoryIcon}</div>
        <div class="text-xs font-semibold truncate">${project.title}</div>
        <div class="text-xs opacity-80 mt-1">📸 Próximamente</div>
      </div>
    `;

    return placeholder;
  }

  private createProjectInfoSection(project: Project): HTMLElement {
    const section = document.createElement('div');
    section.className = 'space-y-3';

    const title = document.createElement('h4');
    title.className = 'font-semibold flex items-center gap-2';
    title.style.color = 'var(--primary-900)';
    title.innerHTML = `
      <svg class="w-4 h-4" style="color: var(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Información del Proyecto
    `;

    const infoGrid = document.createElement('div');
    infoGrid.className = 'grid grid-cols-2 gap-4 text-sm';

    const infoItems = [
      { label: 'Fecha', value: new Date(project.date).toLocaleDateString() },
      { label: 'Equipo', value: `${project.team.size} persona${project.team.size > 1 ? 's' : ''}` },
      { label: 'Duración', value: project.team.duration },
      { label: 'Rol', value: project.team.role }
    ];

    infoItems.forEach(item => {
      const infoItem = document.createElement('div');
      infoItem.className = 'space-y-1';
      infoItem.innerHTML = `
        <div class="text-xs font-medium uppercase tracking-wide" style="color: var(--text-secondary)">${item.label}</div>
        <div style="color: var(--text-primary)">${item.value}</div>
      `;
      infoGrid.appendChild(infoItem);
    });

    section.appendChild(title);
    section.appendChild(infoGrid);
    return section;
  }

  private createLinksSection(project: Project): HTMLElement | null {
    const links: HTMLElement[] = [];

    if (project.demoUrl) {
      const demoLink = this.createActionButton(
        project.demoUrl,
        'Ver Demo',
        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>`
      );
      links.push(demoLink);
    }

    if (project.repoUrl) {
      const repoLink = this.createActionButton(
        project.repoUrl,
        'Ver Código',
        'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black',
        `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>`
      );
      links.push(repoLink);
    }

    if (links.length === 0) return null;

    const section = document.createElement('div');
    section.className = 'flex flex-wrap gap-3 pt-2';
    links.forEach(link => section.appendChild(link));

    return section;
  }

  private createActionButton(url: string, text: string, colorClasses: string, iconSvg: string): HTMLElement {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = `inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${colorClasses}`;
    link.innerHTML = `${iconSvg}<span>${text}</span>`;
    return link;
  }

  private setupGalleryEventListeners(project: Project): void {
    const popup = Swal.getPopup();
    if (!popup) return;

    // Event listeners para thumbnails de galería
    const galleryThumbnails = popup.querySelectorAll('.gallery-thumbnail');
    galleryThumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt((e.currentTarget as HTMLElement).dataset['index'] || '0');
        Swal.close();
        this.openGallery(project, index);
      });
    });

    // Event listener para botón "Ver todas las capturas"
    const viewAllButton = popup.querySelector('#view-all-gallery');
    viewAllButton?.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.close();
      this.openGallery(project, 0);
    });
  }

  private adjustThemeColors(): void {
    const popup = Swal.getPopup();
    if (!popup) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      popup.style.backgroundColor = '#1f2937';
      popup.style.color = '#f9fafb';
    }
  }
}
