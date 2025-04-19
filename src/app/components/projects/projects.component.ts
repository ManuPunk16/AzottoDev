import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project.model';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    DatePipe
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
}
