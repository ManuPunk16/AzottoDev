import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    DatePipe,
    NgClass
  ],
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  featuredProjects: Project[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>('/assets/projects.json').subscribe({
      next: (data) => {
        this.projects = data;
        this.featuredProjects = data.filter(project => project.featured);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  showProjectDetails(project: Project): void {
    const techBadges = project.technologies.map(tech =>
      `<span class="inline-block bg-[var(--tag-bg)] text-[var(--tag-text)] text-xs px-2 py-1 rounded-full m-1">${tech}</span>`
    ).join('');

    // Añade la clase de categoría para mostrar el color adecuado
    const categoryBadge = `<span class="inline-block category-${project.category.toLowerCase()} text-xs px-3 py-1 rounded-full mb-3">${project.category}</span>`;

    const links = [];
    if (project.demoUrl) {
      links.push(`
        <a href="${project.demoUrl}" target="_blank" class="inline-flex items-center text-[var(--primary-600)] hover:text-[var(--primary-800)] transition-colors mx-2">
          <span>Demo</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
      `);
    }

    if (project.repoUrl) {
      links.push(`
        <a href="${project.repoUrl}" target="_blank" class="inline-flex items-center text-[var(--primary-600)] hover:text-[var(--primary-800)] transition-colors mx-2">
          <span>Código</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      `);
    }

    const linksHtml = links.length > 0 ? `<div class="flex justify-center mt-4">${links.join('')}</div>` : '';

    // Configuramos SweetAlert2 para que use colores coherentes con nuestro tema claro/oscuro
    Swal.fire({
      title: project.title,
      html: `
        <div class="text-left">
          ${categoryBadge}
          <div class="my-3 text-sm text-[var(--text-secondary)]">
            Fecha: ${new Date(project.date).toLocaleDateString()}
          </div>
          <div class="mb-4 text-[var(--text-primary)]">
            ${project.longDescription}
          </div>
          <div class="mb-3">
            <div class="font-semibold mb-1 text-[var(--primary-800)]">Tecnologías:</div>
            <div class="flex flex-wrap">
              ${techBadges}
            </div>
          </div>
          ${linksHtml}
        </div>
      `,
      imageUrl: project.imageUrl || '/assets/images/default-project.webp',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: project.title,
      background: 'var(--background-primary)',
      color: 'var(--primary-900)',
      confirmButtonColor: 'var(--primary-600)',
      customClass: {
        popup: 'swal-project-details',
      },
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  // Añade esta función para manejar rutas de imágenes
  getImageUrl(path: string): string {
    if (!path) {
      return './assets/images/default-project.webp';
    }

    // Si la ruta ya es absoluta (comienza con http o https), la devolvemos tal cual
    if (path.startsWith('http')) {
      return path;
    }

    // Asegurar que la ruta comience con ./
    if (!path.startsWith('./') && !path.startsWith('/')) {
      path = './' + path;
    } else if (path.startsWith('/')) {
      path = '.' + path;
    }

    return path;
  }
}
