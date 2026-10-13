const fs = require('fs');
const path = require('path');

const staticRoutes = [
  '/',
  '/projects',
  '/articles'
];

try {
  const projectsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/assets/projects.json'), 'utf8')
  );
  const articlesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/assets/articles.json'), 'utf8')
  );

  const projectRoutes = projectsData.map(p => `/projects/${p.id}`);
  const articleRoutes = articlesData.map(a => `/articles/${a.slug}`);

  const allRoutes = [...staticRoutes, ...projectRoutes, ...articleRoutes];
  const outputPath = path.join(__dirname, '../routes.txt');

  fs.writeFileSync(outputPath, allRoutes.join('\n'), 'utf8');
  console.log(`[SUCCESS] routes.txt generado: ${allRoutes.length} rutas prerenderizadas.`);
  allRoutes.forEach(route => console.log(`  - ${route}`));
} catch (error) {
  console.error('[ERROR] Error generando routes.txt:', error.message);
  process.exit(1);
}
