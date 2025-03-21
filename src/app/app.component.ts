import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { NgOptimizedImage, NgIf } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    NgOptimizedImage,
    MarkdownModule,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  currentYear!: number;

  constructor(
    public themeService: ThemeService
  ) {

  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
