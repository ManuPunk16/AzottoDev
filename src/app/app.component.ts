import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { NgOptimizedImage } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    MarkdownModule
],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  currentYear!: number;

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      this.router.navigateByUrl(redirectPath);
    }
  }
}
