const fs = require('fs');
const path = require('path');

function generateAdvancedSitemap() {
  const baseUrl = 'https://azotodev.web.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Leer datos
  const projectsPath = path.join(__dirname, '../src/assets/projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  
  // URLs estáticas con prioridades inteligentes
  const staticUrls = [
    { 
      loc: baseUrl, 
      lastmod: currentDate, 
      changefreq: 'weekly', 
      priority: '1.0',
      images: [`${baseUrl}/assets/images/og-image.webp`]
    },
    { 
      loc: `${baseUrl}/home`, 
      lastmod: currentDate, 
      changefreq: 'weekly', 
      priority: '0.9',
      images: [`${baseUrl}/assets/images/home-hero.webp`]
    },
    { 
      loc: `${baseUrl}/projects`, 
      lastmod: getLastProjectUpdate(projects), 
      changefreq: 'weekly', 
      priority: '0.9',
      images: projects.slice(0, 3).map(p => `${baseUrl}${p.imageUrl}`)
    },
    { 
      loc: `${baseUrl}/articles`, 
      lastmod: currentDate, 
      changefreq: 'weekly', 
      priority: '0.8' 
    }
  ];
  
  // URLs de proyectos con prioridades dinámicas
  const projectUrls = projects.map(project => {
    const priority = calculateProjectPriority(project);
    const lastmod = project.lastUpdated || project.date;
    
    return {
      loc: `${baseUrl}/projects/${project.id}`,
      lastmod: lastmod.split('T')[0],
      changefreq: project.status === 'maintenance' ? 'monthly' : 'quarterly',
      priority: priority.toFixed(1),
      images: project.gallery ? 
        project.gallery.slice(0, 5).map(img => `${baseUrl}${img.url}`) : 
        [`${baseUrl}${project.imageUrl}`]
    };
  });
  
  const allUrls = [...staticUrls, ...projectUrls];
  
  const urlsXml = allUrls.map(url => {
    let imageXml = '';
    if (url.images && url.images.length > 0) {
      imageXml = url.images.map(img => `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:caption>Imagen del proyecto - ${url.loc.split('/').pop()}</image:caption>
    </image:image>`).join('');
    }
    
    return `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${imageXml}
  </url>`;
  }).join('');
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}
</urlset>`;
  
  // Escribir sitemap
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml);
  
  generateSitemapIndex();
  
  console.log(`✅ Sitemap avanzado generado con ${allUrls.length} URLs`);
  console.log(`📊 Proyectos: ${projectUrls.length} | URLs estáticas: ${staticUrls.length}`);
  console.log(`🖼️ Total de imágenes indexadas: ${allUrls.reduce((total, url) => total + (url.images?.length || 0), 0)}`);
}

function calculateProjectPriority(project) {
  let priority = 0.7; // Base
  
  if (project.featured) priority += 0.1;
  if (project.privacy === 'public') priority += 0.05;
  if (project.status === 'completed') priority += 0.05;
  if (project.demoUrl) priority += 0.05;
  if (project.repoUrl) priority += 0.05;
  
  return Math.min(priority, 0.9); // Máximo 0.9
}

function getLastProjectUpdate(projects) {
  const dates = projects
    .map(p => p.lastUpdated || p.date)
    .sort((a, b) => new Date(b) - new Date(a));
  
  return dates[0] ? dates[0].split('T')[0] : new Date().toISOString().split('T')[0];
}

function generateSitemapIndex() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://azotodev.web.app/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  const indexPath = path.join(__dirname, '../public/sitemap-index.xml');
  fs.writeFileSync(indexPath, sitemapIndex);
}

generateAdvancedSitemap();