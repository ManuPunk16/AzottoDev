import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MetadataService } from '../../services/metadata.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  relatedProjects: Project[] = [];
  loading = true;
  error = false;
  currentGalleryIndex = 0;
  isGalleryOpen = false;
  
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private metadataService: MetadataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.loadProject(projectId);
        this.scrollToTop();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
    }
  }

  private scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private loadProject(id: string) {
    this.loading = true;
    this.error = false;

    // Cargar proyecto específico
    this.http.get<Project>(`/assets/projects/${id}.json`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (project) => {
        this.project = project;
        this.updateSEOMetadata();
        this.loadRelatedProjects();
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadRelatedProjects() {
    if (!this.project) return;

    // Cargar todos los proyectos para mostrar relacionados
    this.http.get<Project[]>('/assets/projects.json').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (projects) => {
        this.relatedProjects = projects
          .filter(p => p.id !== this.project?.id && p.category === this.project?.category)
          .slice(0, 3);
      },
      error: (err) => console.warn('Error cargando proyectos relacionados:', err)
    });
  }

  private updateSEOMetadata() {
    if (!this.project) return;

    this.metadataService.updatePageMetadata({
      title: `${this.project.title} | Proyecto de ${this.project.category}`,
      description: this.project.longDescription || this.project.description,
      keywords: `${this.project.technologies.join(', ')}, ${this.project.category}, desarrollo web, ${this.project.title}, Luis Hernández`,
      image: `https://azotodev.web.app${this.project.imageUrl}`,
      url: `https://azotodev.web.app/projects/${this.project.id}`,
      type: 'website',
      publishedDate: this.project.date,
      modifiedDate: this.project.lastUpdated || this.project.date
    });
  }

  openGallery(index: number = 0) {
    if (!this.project?.gallery?.length || !this.isBrowser) return;
    
    this.currentGalleryIndex = index;
    this.isGalleryOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeGallery() {
    if (!this.isBrowser) return;
    
    this.isGalleryOpen = false;
    this.currentGalleryIndex = 0;
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    if (!this.project?.gallery?.length) return;
    this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.project.gallery.length;
  }

  previousImage() {
    if (!this.project?.gallery?.length) return;
    this.currentGalleryIndex = this.currentGalleryIndex === 0 
      ? this.project.gallery.length - 1 
      : this.currentGalleryIndex - 1;
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

  getStatusClasses(status: string): string {
    const classMap: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'maintenance': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classMap[status] || 'bg-gray-100 text-gray-800'}`;
  }

  getPrivacyClasses(privacy: string): string {
    const classMap: Record<string, string> = {
      'public': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'internal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'private': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classMap[privacy] || 'bg-gray-100 text-gray-800'}`;
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    console.warn('Error cargando imagen:', event.target.src);
  }

  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }
}
