const fs = require("fs");
const path = require("path");

function generateAdvancedSitemap() {
  console.log("🚀 Generando sitemap avanzado...");

  // Leer datos
  const projectsPath = path.join(__dirname, "../src/assets/projects.json");
  const articlesPath = path.join(__dirname, "../src/assets/articles.json");

  let projects = [];
  let articles = [];

  try {
    projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
  } catch (error) {
    console.warn("⚠️ No se encontró projects.json, usando array vacío");
  }

  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
  } catch (error) {
    console.warn("⚠️ No se encontró articles.json, usando array vacío");
  }

  // URLs estáticas
  const baseUrl = "https://azotodev.web.app";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticUrls = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "1.0",
      images: [],
    },
    {
      loc: `${baseUrl}/home`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "0.9",
      images: [],
    },
    {
      loc: `${baseUrl}/projects`,
      lastmod: getLastProjectUpdate(projects),
      changefreq: "weekly",
      priority: "0.9",
      images:
        projects.length > 0
          ? [
              `${baseUrl}/assets/images/projects/${
                projects[0].id
              }/${projects[0].images?.[0] || "preview.webp"}`,
            ]
          : [],
    },
    {
      loc: `${baseUrl}/articles`,
      lastmod: getLastArticleUpdate(articles),
      changefreq: "weekly",
      priority: "0.8",
      images:
        articles.length > 0
          ? articles
              .slice(0, 2)
              .map((a) => `${baseUrl}/assets/images/articles/${a.image}`)
          : [],
    },
  ];

  // URLs de proyectos
  const projectUrls = projects.map((project) => {
    const priority = calculateProjectPriority(project);
    const lastmod = project.lastUpdated || project.date;
    const images = project.images
      ? project.images.map(
          (img) => `${baseUrl}/assets/images/projects/${project.id}/${img}`
        )
      : [];

    return {
      loc: `${baseUrl}/projects/${project.id}`,
      lastmod: lastmod.split("T")[0],
      changefreq: project.featured ? "weekly" : "quarterly",
      priority: priority.toFixed(1),
      images: images,
    };
  });

  // URLs de artículos
  const articleUrls = articles.map((article) => {
    const priority = calculateArticlePriority(article);
    const lastmod = article.lastUpdated || article.date;
    const images = article.image
      ? [`${baseUrl}/assets/images/articles/${article.image}`]
      : [];

    return {
      loc: `${baseUrl}/articles/${article.slug}`,
      lastmod: lastmod.split("T")[0],
      changefreq: article.featured ? "weekly" : "monthly",
      priority: priority.toFixed(1),
      images: images,
    };
  });

  const allUrls = [...staticUrls, ...projectUrls, ...articleUrls];

  const urlsXml = allUrls
    .map((url) => {
      let imageXml = "";
      if (url.images && url.images.length > 0) {
        imageXml = url.images
          .map(
            (img) => `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:caption>Imagen del contenido - ${url.loc.split("/").pop()}</image:caption>
    </image:image>`
          )
          .join("");
      }

      return `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${imageXml}
  </url>`;
    })
    .join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}
</urlset>`;

  // Escribir en múltiples ubicaciones
  const locations = [
    path.join(__dirname, "../public/sitemap.xml"),
    path.join(__dirname, "../src/sitemap.xml"),
  ];

  // Crear directorios si no existen
  locations.forEach((location) => {
    const dir = path.dirname(location);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(location, sitemapXml);
  });

  generateSitemapIndex();

  console.log(`✅ Sitemap avanzado generado con ${allUrls.length} URLs`);
  console.log(
    `📊 Proyectos: ${projectUrls.length} | Artículos: ${articleUrls.length} | URLs estáticas: ${staticUrls.length}`
  );
}

function calculateProjectPriority(project) {
  let priority = 0.7; // Base para proyectos

  if (project.featured) priority += 0.2;
  if (project.status === "completed") priority += 0.1;
  if (project.technologies && project.technologies.includes("Angular"))
    priority += 0.05;

  return Math.min(priority, 0.9); // Máximo 0.9 para proyectos
}

function calculateArticlePriority(article) {
  let priority = 0.6; // Base para artículos

  if (article.featured) priority += 0.15;
  if (article.category === "tutorial") priority += 0.1;
  if (article.tags && article.tags.includes("angular")) priority += 0.05;
  if (article.readTime && article.readTime < 10) priority += 0.05;

  return Math.min(priority, 0.8);
}

function getLastProjectUpdate(projects) {
  if (projects.length === 0)
    return new Date().toISOString().split("T")[0];

  const dates = projects
    .map((p) => p.lastUpdated || p.date)
    .sort((a, b) => new Date(b) - new Date(a));

  return dates[0]
    ? dates[0].split("T")[0]
    : new Date().toISOString().split("T")[0];
}

function getLastArticleUpdate(articles) {
  if (articles.length === 0)
    return new Date().toISOString().split("T")[0];

  const dates = articles
    .map((a) => a.lastUpdated || a.date)
    .sort((a, b) => new Date(b) - new Date(a));

  return dates[0]
    ? dates[0].split("T")[0]
    : new Date().toISOString().split("T")[0];
}

function generateSitemapIndex() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://azotodev.web.app/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Escribir en múltiples ubicaciones
  const locations = [
    path.join(__dirname, "../public/sitemap-index.xml"),
    path.join(__dirname, "../src/sitemap-index.xml"),
  ];

  locations.forEach((location) => {
    const dir = path.dirname(location);
    if (!fs.existsSync(dir, { recursive: true }));
    fs.writeFileSync(location, sitemapIndex);
  });
}

generateAdvancedSitemap();
