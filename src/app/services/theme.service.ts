import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string | null = null;

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: string | null): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme || '');
    localStorage.setItem('theme', theme || '');
  }

  getTheme(): string | null {
    return this.currentTheme;
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'dark' ? null : 'dark';
    this.setTheme(newTheme);
  }

  private loadTheme(): void {
    const storedTheme = localStorage.getItem('theme');
    this.setTheme(storedTheme);
  }
}
