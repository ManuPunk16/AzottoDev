import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('../app/components/home/home.component').then(c => c.HomeComponent),
    pathMatch: 'full'
  },
  // {
  //   path: 'about',
  //   loadComponent: () => import('../app/components/about/about.component').then(c => c.AboutComponent),
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'contact',
  //   loadComponent: () => import('../app/components/contact/contact.component').then(c => c.ContactComponent),
  //   pathMatch: 'full'
  // },
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
  {
    path: 'projects',
    loadComponent: () => import('../app/components/projects/projects.component').then(c => c.ProjectsComponent),
    pathMatch: 'full'
  },
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
