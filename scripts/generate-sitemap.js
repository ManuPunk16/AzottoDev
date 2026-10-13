const fs = require("fs");
const path = require("path");

const baseUrl = "https://azotodev.com";
const today = new Date().toISOString().split("T")[0];

console.log("[INFO] Generando sitemap para azotodev.com...");

try {
  // Leer datos reales con manejo de errores
  const projectsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../src/assets/projects.json"), "utf8")
  );
  const articlesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../src/assets/articles.json"), "utf8")
  );

  // Generar sitemap optimizado para SEO
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Página principal -->
  <url>
    <loc>${baseUrl}</loc>
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

  <!-- Proyectos individuales con imágenes -->
  ${projectsData
    .map(
      (project) => `
  <url>
    <loc>${baseUrl}/projects/${project.id}</loc>
    <lastmod>${project.lastUpdated || project.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${project.featured ? "0.9" : "0.8"}</priority>
    ${
      project.images && project.images.length > 0
        ? project.images
            .slice(0, 3)
            .map(
              (img) => `
    <image:image>
      <image:loc>${baseUrl}/assets/images/projects/${project.id}/${img}</image:loc>
      <image:caption>Proyecto ${project.title} - ${project.description}</image:caption>
      <image:title>${project.title}</image:title>
    </image:image>`
            )
            .join("")
        : ""
    }
  </url>`
    )
    .join("")}

  <!-- Artículos individuales con imágenes -->
  ${articlesData
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.publishDate || article.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${article.featured ? "0.8" : "0.7"}</priority>
    ${
      article.image
        ? `
    <image:image>
      <image:loc>${baseUrl}/assets/images/articles/${article.image}</image:loc>
      <image:caption>Artículo: ${article.title}</image:caption>
      <image:title>${article.title}</image:title>
    </image:image>`
        : ""
    }
  </url>`
    )
    .join("")}

</urlset>`;

  // Escribir archivos
  const outputDir = path.join(__dirname, "../public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, "sitemap.xml"), sitemap);

  console.log("[SUCCESS] Sitemap generado exitosamente");
  console.log(`[INFO] Base URL: ${baseUrl}`);
  console.log(
    `[INFO] URLs totales: ${5 + projectsData.length + articlesData.length}`
  );
  console.log(`[INFO] Proyectos: ${projectsData.length}`);
  console.log(`[INFO] Artículos: ${articlesData.length}`);
} catch (error) {
  console.error("[ERROR] Error generando sitemap:", error.message);
  process.exit(1);
}
