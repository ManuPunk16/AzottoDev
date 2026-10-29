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

  <!-- Pagina principal -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Paginas principales -->
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

  <!-- Proyectos individuales con imagenes -->
  ${projectsData
    .map((project) => {
      let projectImages = [];
      const projectDetailPath = path.join(
        __dirname,
        `../src/assets/projects/${project.id}.json`
      );

      if (fs.existsSync(projectDetailPath)) {
        try {
          const detail = JSON.parse(fs.readFileSync(projectDetailPath, "utf8"));
          if (detail.gallery && Array.isArray(detail.gallery)) {
            projectImages = detail.gallery.map((g) => ({
              loc: g.url.startsWith("http")
                ? g.url
                : `${baseUrl}${g.url.startsWith(".") ? g.url.substring(1) : g.url}`,
              title: g.alt || project.title,
              caption: g.caption || `${project.title} - ${project.description}`,
            }));
          }
        } catch (e) {
          // Fallback
        }
      }

      if (project.id === "venta-simple") {
        projectImages = [
          {
            loc: `${baseUrl}/assets/images/projects/ventasimple/dashboard-desktop.webp`,
            title: "VentaSimple - Dashboard Operativo Desktop",
            caption:
              "Panel de control principal de punto de venta e inventario en tiempo real",
          },
          {
            loc: `${baseUrl}/assets/images/projects/ventasimple/dashboard-mobile.webp`,
            title: "VentaSimple - Interfaz Mobile-First",
            caption:
              "Terminal de ventas optimizada para dispositivos moviles y smartphones",
          },
          {
            loc: `${baseUrl}/assets/images/projects/ventasimple/reportes-metricas.webp`,
            title: "VentaSimple - Modulo de Metricas y Analitica",
            caption:
              "Panel analitico con balances, margenes comerciales y estado de flujo de caja",
          },
          {
            loc: `${baseUrl}/assets/images/projects/ventasimple/arquitectura-pos.svg`,
            title: "VentaSimple - Arquitectura Tecnica de Sistema",
            caption:
              "Diagrama de arquitectura multi-tenant cloud-native con Angular y Node.js",
          },
        ];
      } else if (projectImages.length === 0 && project.imageUrl) {
        projectImages = [
          {
            loc: project.imageUrl.startsWith("http")
              ? project.imageUrl
              : `${baseUrl}${project.imageUrl}`,
            title: project.title,
            caption: `${project.title} - ${project.description}`,
          },
        ];
      }

      const imagesXml = projectImages
        .map(
          (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`
        )
        .join("");

      return `
  <url>
    <loc>${baseUrl}/projects/${project.id}</loc>
    <lastmod>${project.lastUpdated || project.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${project.featured ? "0.9" : "0.8"}</priority>${imagesXml}
  </url>`;
    })
    .join("")}

  <!-- Articulos individuales con imagenes -->
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
      <image:title>${article.title}</image:title>
      <image:caption>Articulo: ${article.title}</image:caption>
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
    `[INFO] URLs totales: ${3 + projectsData.length + articlesData.length}`
  );
  console.log(`[INFO] Proyectos: ${projectsData.length}`);
  console.log(`[INFO] Articulos: ${articlesData.length}`);
} catch (error) {
  console.error("[ERROR] Error generando sitemap:", error.message);
  process.exit(1);
}
