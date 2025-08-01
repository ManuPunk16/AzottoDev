const fs = require("fs");
const path = require("path");

function generateAdvancedSitemap() {
  const baseUrl = "https://azotodev.web.app";
  const currentDate = new Date().toISOString().split("T")[0];

  const projectsPath = path.join(__dirname, "../src/assets/projects.json");
  const articlesPath = path.join(__dirname, "../src/assets/articles.json");

  let projects = [];
  let articles = [];

  // Leer proyectos
  try {
    projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    console.log(`📂 Proyectos cargados: ${projects.length}`);
  } catch (error) {
    console.warn("⚠️ Error leyendo projects.json:", error.message);
  }

  // ✅ NUEVO: Leer artículos
  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
    console.log(`📰 Artículos cargados: ${articles.length}`);
  } catch (error) {
    console.warn("⚠️ Error leyendo articles.json:", error.message);
  }

  // FUNCIÓN HELPER para limpiar rutas de imágenes
  function cleanImageUrl(imageUrl) {
    if (!imageUrl) return null;

    // Remover './' del inicio si existe
    const cleanUrl = imageUrl.startsWith("./")
      ? imageUrl.substring(2)
      : imageUrl;

    // Asegurar que comience con '/'
    const finalUrl = cleanUrl.startsWith("/") ? cleanUrl : "/" + cleanUrl;

    return `${baseUrl}${finalUrl}`;
  }

  // URLs estáticas con prioridades inteligentes
  const staticUrls = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "1.0",
      images: [`${baseUrl}/assets/images/og-image.webp`],
    },
    {
      loc: `${baseUrl}/home`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "0.9",
      images: [`${baseUrl}/assets/images/home-hero.webp`],
    },
    {
      loc: `${baseUrl}/projects`,
      lastmod:
        projects.length > 0 ? getLastProjectUpdate(projects) : currentDate,
      changefreq: "weekly",
      priority: "0.9",
      images:
        projects.length > 0
          ? projects
              .slice(0, 3)
              .map((p) => cleanImageUrl(p.imageUrl))
              .filter((img) => img !== null)
          : [],
    },
    {
      loc: `${baseUrl}/articles`,
      lastmod:
        articles.length > 0 ? getLastArticleUpdate(articles) : currentDate,
      changefreq: "weekly",
      priority: "0.8",
      images:
        articles.length > 0
          ? articles
              .slice(0, 3)
              .map((a) => cleanImageUrl(a.image))
              .filter((img) => img !== null)
          : [],
    },
  ];

  // URLs de proyectos con prioridades dinámicas
  const projectUrls = projects.map((project) => {
    const priority = calculateProjectPriority(project);
    const lastmod = project.lastUpdated || project.date;

    // Procesar imágenes correctamente
    let images = [];
    if (project.gallery && project.gallery.length > 0) {
      images = project.gallery
        .slice(0, 5)
        .map((img) => cleanImageUrl(img.url))
        .filter((img) => img !== null);
    } else if (project.imageUrl) {
      const cleanImg = cleanImageUrl(project.imageUrl);
      if (cleanImg) images = [cleanImg];
    }

    return {
      loc: `${baseUrl}/projects/${project.id}`,
      lastmod: lastmod.split("T")[0],
      changefreq: project.status === "maintenance" ? "monthly" : "quarterly",
      priority: priority.toFixed(1),
      images: images,
    };
  });

  const articleUrls = articles.map((article) => {
    const priority = calculateArticlePriority(article);
    const lastmod = article.lastUpdated || article.date;

    // Procesar imágenes del artículo
    let images = [];
    if (article.image) {
      const cleanImg = cleanImageUrl(article.image);
      if (cleanImg) images = [cleanImg];
    }

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
      <image:caption>Imagen del contenido - ${url.loc
        .split("/")
        .pop()}</image:caption>
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

  // Escribir sitemap
  const outputPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(outputPath, sitemapXml);

  generateSitemapIndex();

  console.log(`✅ Sitemap avanzado generado con ${allUrls.length} URLs`);
  console.log(
    `📊 Proyectos: ${projectUrls.length} | Artículos: ${articleUrls.length} | URLs estáticas: ${staticUrls.length}`
  );
  console.log(
    `🖼️ Total de imágenes indexadas: ${allUrls.reduce(
      (total, url) => total + (url.images?.length || 0),
      0
    )}`
  );

  // Verificar URLs de imágenes
  const allImages = allUrls.flatMap((url) => url.images || []);
  console.log("🔍 Verificando rutas de imágenes...");
  allImages.forEach((img) => {
    if (img.includes("azotodev.web.app./") || img.includes("./")) {
      console.warn(`⚠️ URL problemática detectada: ${img}`);
    }
  });
  console.log("✅ Verificación de imágenes completada");
}

function calculateProjectPriority(project) {
  let priority = 0.7; // Base

  if (project.featured) priority += 0.1;
  if (project.privacy === "public") priority += 0.05;
  if (project.status === "completed") priority += 0.05;
  if (project.demoUrl) priority += 0.05;
  if (project.repoUrl) priority += 0.05;

  return Math.min(priority, 0.9); // Máximo 0.9
}

function calculateArticlePriority(article) {
  let priority = 0.6; // Base para artículos

  if (article.featured) priority += 0.15;
  if (article.category === "tutorial") priority += 0.1;
  if (article.tags && article.tags.includes("angular")) priority += 0.05;
  if (article.readTime && article.readTime < 10) priority += 0.05; // Artículos cortos

  return Math.min(priority, 0.8); // Máximo 0.8 para artículos
}

function getLastProjectUpdate(projects) {
  const dates = projects
    .map((p) => p.lastUpdated || p.date)
    .sort((a, b) => new Date(b) - new Date(a));

  return dates[0]
    ? dates[0].split("T")[0]
    : new Date().toISOString().split("T")[0];
}

function getLastArticleUpdate(articles) {
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

  const indexPath = path.join(__dirname, "../public/sitemap-index.xml");
  fs.writeFileSync(indexPath, sitemapIndex);
}

generateAdvancedSitemap();
