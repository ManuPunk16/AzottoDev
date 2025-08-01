import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [DatePipe, NgClass, RouterLink],
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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'web': '🌐',
      'fullstack': '⚡',
      'frontend': '🎨',
      'backend': '⚙️',
      'mobile': '📱',
      'desktop': '💻'
    };
    return icons[category.toLowerCase()] || '💼';
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'Completado',
      'in-progress': 'En desarrollo',
      'planned': 'Planificado',
      'maintenance': 'En mantenimiento'
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClasses(status: string): string {
    const classMap: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'maintenance': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classMap[status] || 'bg-gray-100 text-gray-800'}`;
  }

  getPrivacyBadgeClasses(privacy: string): string {
    const classMap: Record<string, string> = {
      'public': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'internal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'private': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classMap[privacy] || 'bg-gray-100 text-gray-800'}`;
  }

  getPrivacyIcon(privacy: string): string {
    const icons: Record<string, string> = {
      'public': '🌐',
      'internal': '🏢',
      'private': '🔒'
    };
    return icons[privacy] || '📁';
  }

  onImageError(event: any, project: Project): void {
    const target = event.target as HTMLImageElement;
    
    // ✅ Solo ocultar la imagen, mantener la estructura
    target.style.display = 'none';
    
    // ✅ Crear placeholder DENTRO del contenedor de imagen
    const placeholder = document.createElement('div');
    placeholder.className = 'absolute inset-0 w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex flex-col items-center justify-center text-white';
    placeholder.innerHTML = `
      <div class="text-4xl mb-2 animate-pulse">${this.getCategoryIcon(project.category)}</div>
      <div class="text-lg font-bold text-center px-4">${project.title}</div>
      <div class="text-sm opacity-80 mt-1">Imagen próximamente</div>
    `;
    
    // ✅ Agregar el placeholder sin borrar los botones
    target.parentElement?.insertBefore(placeholder, target);
  }

  private createImagePlaceholder(project: Project): string {
    const gradients = [
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-pink-400 via-red-500 to-yellow-500',
      'from-indigo-400 via-purple-500 to-pink-500',
      'from-cyan-400 via-blue-500 to-indigo-600'
    ];
    
    const gradient = gradients[Math.abs(project.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length];
    const categoryIcon = this.getCategoryIcon(project.category);
    
    return `
      <div class="w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div class="text-4xl mb-2 animate-pulse">${categoryIcon}</div>
        <div class="text-lg font-bold text-center px-4">${project.title}</div>
        <div class="text-sm opacity-90 mt-1">${project.category}</div>
      </div>
    `;
  }
}
