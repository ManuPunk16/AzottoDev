const fs = require('fs');
const path = require('path');

const baseUrl = 'https://azotodev.vercel.app'; // URL correcta de Vercel
const today = new Date().toISOString().split('T')[0];

// Leer datos reales
const projectsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/assets/projects.json'), 'utf8')
);
const articlesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/assets/articles.json'), 'utf8')
);

// Generar sitemap optimizado
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Página principal -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Páginas principales -->
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Proyectos individuales -->
  ${projectsData
    .map(
      (project) => `
  <url>
    <loc>${baseUrl}/projects/${project.id}</loc>
    <lastmod>${project.lastUpdated || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    ${
      project.images && project.images.length > 0
        ? project.images
            .slice(0, 3)
            .map(
              (img) => `
    <image:image>
      <image:loc>${baseUrl}/assets/images/projects/${project.id}/${img}</image:loc>
      <image:caption>Proyecto ${project.title}</image:caption>
    </image:image>`
            )
            .join('')
        : ''
    }
  </url>`
    )
    .join('')}

  <!-- Artículos individuales -->
  ${articlesData
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.publishDate || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${
      article.image
        ? `
    <image:image>
      <image:loc>${baseUrl}/assets/images/articles/${article.image}</image:loc>
      <image:caption>Artículo: ${article.title}</image:caption>
    </image:image>`
        : ''
    }
  </url>`
    )
    .join('')}

</urlset>`;

// Robots.txt optimizado
const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Optimización para crawlers
Crawl-delay: 1

# URLs específicas permitidas
Allow: /projects/
Allow: /articles/
Allow: /assets/images/

# Bloquear archivos innecesarios
Disallow: /*.json$
Disallow: /assets/articles/
Disallow: /assets/projects/`;

// Escribir archivos
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots);

console.log('✅ Sitemap y robots.txt generados para Vercel');
console.log(`📊 URLs: ${3 + projectsData.length + articlesData.length}`);
