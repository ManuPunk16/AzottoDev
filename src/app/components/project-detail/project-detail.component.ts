import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MetadataService } from '../../services/metadata.service';
import { MetaService } from '../../services/meta.service';
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
  imageFailed = false;
  currentGalleryIndex = 0;
  isGalleryOpen = false;
  
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private metadataService: MetadataService,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        this.resetComponent();
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
    this.metadataService.clearStructuredData();
  }

  private resetComponent(): void {
    this.loading = true;
    this.error = false;
    this.imageFailed = false;
    this.project = null;
    this.relatedProjects = [];
    this.isGalleryOpen = false;
    this.currentGalleryIndex = 0;
  }

  private scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private loadProject(id: string) {
    this.loading = true;
    this.error = false;

    this.http.get<Project>(`/assets/projects/${id}.json`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (project) => {
        this.project = project;
        this.metadataService.updateProjectMetadata(project);
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

    this.http.get<Project[]>('/assets/projects.json').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (projects) => {
        this.relatedProjects = projects
          .filter(p => p.id !== this.project?.id)
          .slice(0, 3);
      },
      error: (err) => console.warn('Error cargando proyectos relacionados:', err)
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

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'Completado',
      'in-progress': 'En producción',
      'planned': 'Planificado',
      'maintenance': 'En mantenimiento'
    };
    return statusMap[status] || status;
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  onImageError(event: any) {
    this.imageFailed = true;
  }
}
