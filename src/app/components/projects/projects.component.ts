import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, DatePipe, RouterLink],
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  featuredProject: Project | null = null;
  gridProjects: Project[] = [];
  loading: boolean = true;
  error: boolean = false;
  expandedProjects = new Set<string>();
  failedImages = new Set<string>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  toggleTechDetails(projectId: string): void {
    if (this.expandedProjects.has(projectId)) {
      this.expandedProjects.delete(projectId);
    } else {
      this.expandedProjects.add(projectId);
    }
  }

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
    // VentaSimple como proyecto destacado Hero
    const vs = this.projects.find(p => p.id === 'venta-simple');
    if (vs) {
      this.featuredProject = vs;
      this.gridProjects = this.projects.filter(p => p.id !== 'venta-simple');
    } else if (this.projects.length > 0) {
      this.featuredProject = this.projects[0];
      this.gridProjects = this.projects.slice(1);
    } else {
      this.featuredProject = null;
      this.gridProjects = [];
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  onImageError(projectId: string): void {
    this.failedImages.add(projectId);
  }

  hasImageFailed(projectId: string): boolean {
    return this.failedImages.has(projectId);
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'Completado',
      'in-progress': 'En producción',
      'planned': 'Planificado',
      'maintenance': 'En mantenimiento'
    };
    return statusMap[status] || status;
  }
}
