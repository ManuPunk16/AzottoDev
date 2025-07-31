const fs = require('fs');
const path = require('path');

// Leer archivos JSON existentes
const projectsPath = path.join(__dirname, '../src/assets/projects.json');
const articlesPath = path.join(__dirname, '../src/assets/articles.json');

const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const baseUrl = 'https://azotodev.web.app';
const currentDate = new Date().toISOString().split('T')[0];

// URLs estáticas basadas en tus rutas actuales
const staticUrls = [
  { 
    loc: baseUrl, 
    lastmod: currentDate, 
    changefreq: 'weekly', 
    priority: '1.0' 
  },
  { 
    loc: `${baseUrl}/home`, 
    lastmod: currentDate, 
    changefreq: 'weekly', 
    priority: '0.9' 
  },
  { 
    loc: `${baseUrl}/projects`, 
    lastmod: currentDate, 
    changefreq: 'weekly', 
    priority: '0.9' 
  },
  { 
    loc: `${baseUrl}/articles`, 
    lastmod: currentDate, 
    changefreq: 'weekly', 
    priority: '0.9' 
  }
];

// URLs dinámicas de proyectos
const projectUrls = projects.map(project => ({
  loc: `${baseUrl}/projects/${project.id}`,
  lastmod: (project.lastUpdated || project.date).split('T')[0],
  changefreq: 'monthly',
  priority: project.featured ? '0.8' : '0.7'
}));

// URLs dinámicas de artículos
const articleUrls = articles.map(article => ({
  loc: `${baseUrl}/articles/${article.slug}`,
  lastmod: article.date.split('T')[0],
  changefreq: 'monthly',
  priority: article.featured ? '0.8' : '0.7'
}));

// Combinar todas las URLs
const allUrls = [...staticUrls, ...projectUrls, ...articleUrls];

// Generar XML del sitemap
const urlsXml = allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

// Escribir sitemap en public
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml);

console.log(`✅ Sitemap generado con ${allUrls.length} URLs`);
console.log(`📁 Guardado en: ${outputPath}`);

// Log de estadísticas
console.log(`📊 Estadísticas:`);
console.log(`   - URLs estáticas: ${staticUrls.length}`);
console.log(`   - Proyectos: ${projectUrls.length}`);
console.log(`   - Artículos: ${articleUrls.length}`);
console.log(`   - Total: ${allUrls.length}`);