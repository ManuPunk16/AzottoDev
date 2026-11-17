import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll.directive';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, DatePipe, RouterLink, AnimateOnScrollDirective],
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
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.loading = true;
    this.error = false;
    this.http.get<Project[]>('/assets/projects.json').subscribe({
      next: (data) => {
        this.projects = data;
        this.categorizeProjects();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.error = true;
        this.loading = false;
        this.cdr.markForCheck();
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
