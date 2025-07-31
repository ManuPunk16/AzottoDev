import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private readonly baseUrl = 'https://azotodev.web.app';

  constructor(private http: HttpClient) {}

  generateDynamicSitemap(): Observable<string> {
    const projects$ = this.http.get<any[]>('/assets/projects.json');
    const articles$ = this.http.get<any[]>('/assets/articles.json');

    return combineLatest([projects$, articles$]).pipe(
      map(([projects, articles]) => {
        const staticUrls = this.getStaticUrls();
        const projectUrls = this.getProjectUrls(projects);
        const articleUrls = this.getArticleUrls(articles);
        
        const allUrls = [...staticUrls, ...projectUrls, ...articleUrls];
        return this.buildXmlSitemap(allUrls);
      })
    );
  }

  private getStaticUrls() {
    const currentDate = new Date().toISOString().split('T')[0];
    return [
      { loc: this.baseUrl, lastmod: currentDate, changefreq: 'weekly', priority: '1.0' },
      { loc: `${this.baseUrl}/home`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
      { loc: `${this.baseUrl}/projects`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
      { loc: `${this.baseUrl}/articles`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' }
    ];
  }

  private getProjectUrls(projects: any[]) {
    return projects.map(project => ({
      loc: `${this.baseUrl}/projects/${project.id}`,
      lastmod: (project.lastUpdated || project.date).split('T')[0],
      changefreq: 'monthly',
      priority: project.featured ? '0.8' : '0.7'
    }));
  }

  private getArticleUrls(articles: any[]) {
    return articles.map(article => ({
      loc: `${this.baseUrl}/articles/${article.slug}`,
      lastmod: article.date.split('T')[0],
      changefreq: 'monthly',
      priority: article.featured ? '0.8' : '0.7'
    }));
  }

  private buildXmlSitemap(urls: any[]): string {
    const urlsXml = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }
}