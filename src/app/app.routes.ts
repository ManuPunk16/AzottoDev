import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('../app/components/home/home.component').then(c => c.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadComponent: () => import('../app/components/projects/projects.component').then(c => c.ProjectsComponent),
    pathMatch: 'full'
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('../app/components/project-detail/project-detail.component').then(c => c.ProjectDetailComponent),
    pathMatch: 'full'
  },
  {
    path: 'articles',
    loadComponent: () => import('../app/components/article-list/article-list.component').then(c => c.ArticleListComponent),
    pathMatch: 'full'
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('../app/components/article/article.component').then(c => c.ArticleComponent),
    pathMatch: 'full'
  },
  // {
  //   path: 'about',
  //   loadComponent: () => import('../app/components/about/about.component').then(c => c.AboutComponent),
  //   title: 'Sobre mí | Luis Hernández - Desarrollador Full Stack',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'contact',
  //   loadComponent: () => import('../app/components/contact/contact.component').then(c => c.ContactComponent),
  //   title: 'Contacto | Luis Hernández - Desarrollador Full Stack',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('../app/components/error/error.component').then(c => c.ErrorComponent)
  }
];
