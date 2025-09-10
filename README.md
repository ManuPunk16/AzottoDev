# 🌟 AzotoDev - Portfolio Personal

> Portfolio profesional de Luis Hernández (AzotoDev) desarrollado con Angular 20, TypeScript y Tailwind CSS

[![Demo Live](https://img.shields.io/badge/Demo-azotodev.com-success)](https://azotodev.com)
[![Angular](https://img.shields.io/badge/Angular-20.1-red)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

## 🎨 Características

- ⚡ **Angular 20** con Standalone Components
- 🎭 **Tema dual** (claro/oscuro) con persistencia
- 📱 **100% Responsive** con Tailwind CSS 4.0
- 🔍 **SEO Optimizado** con meta tags dinámicos y Schema.org
- 📊 **Performance** 95+ en Lighthouse
- 🖼️ **Galería de proyectos** con modal interactivo
- 📚 **Blog técnico** con Markdown y syntax highlighting
- 🎯 **TypeScript** estricto
- 🚀 **PWA** completa con Service Worker
- 🌐 **Dominio personalizado** en Vercel

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 20.1, TypeScript 5.8, Tailwind CSS 4.0
- **Hosting**: Vercel con dominio personalizado
- **Build**: Angular CLI + esbuild
- **Styling**: SCSS + CSS Variables para temas
- **Analytics**: Vercel Analytics
- **PWA**: Angular Service Worker

## 🚀 Demo Live

👉 **[azotodev.com](https://azotodev.com)**

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes standalone
│   ├── services/       # Servicios (metadata, sitemap, theme)
│   ├── models/         # Interfaces TypeScript
│   └── app.routes.ts   # Configuración de rutas
├── assets/
│   ├── projects.json   # Datos de proyectos
│   ├── articles.json   # Datos de artículos
│   ├── projects/       # JSONs individuales para SEO
│   ├── articles/       # Contenido Markdown
│   └── images/         # Imágenes optimizadas WebP
├── public/
│   ├── sitemap.xml     # Generado automáticamente
│   ├── robots.txt      # Optimizado para SEO
│   └── manifest.webmanifest
└── styles.scss         # Sistema de temas CSS
```

## 💻 Desarrollo Local

```bash
# Clonar e instalar
git clone https://github.com/ManuPunk16/azotodev-portfolio.git
cd azotodev-portfolio
npm install

# Desarrollo
npm start  # Puerto 4400

# Generar sitemap
npm run generate:sitemap

# Build de producción
npm run build

# Deploy a Vercel
npm run deploy:vercel
```

## 🎯 Características Técnicas Destacadas

### SEO Optimizado
- ✅ Meta tags dinámicos por página
- ✅ Sitemap XML automático
- ✅ Robots.txt optimizado
- ✅ Schema.org JSON-LD
- ✅ Open Graph completo
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Breadcrumbs estructurados

### Sistema de Temas Dinámico
```scss
:root {
  --primary-500: #8B5CF6;
  --background-primary: #FFFFFF;
}

[data-theme="dark"] {
  --primary-500: #A855F7; 
  --background-primary: #1F2937;
}
```

### Componentes Standalone (Angular 20)
```typescript
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ...
})
```

## 📈 Performance & SEO

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Core Web Vitals**: ✅ Todas verdes
- **SEO Score**: 100/100

## 🔧 Scripts Disponibles

```json
{
  "start": "ng serve --port 4400 --open",
  "build": "npm run generate:sitemap && ng build --configuration production",
  "generate:sitemap": "node scripts/generate-sitemap.js",
  "deploy:vercel": "vercel --prod"
}
```

## 🌟 Funcionalidades

### 🏠 Página Principal
- Hero section con animaciones
- Resumen de proyectos destacados
- Enlaces a redes sociales
- CTA para contacto

### 📁 Proyectos
- Galería interactiva
- Filtros por tecnología
- Modal con detalles completos
- Enlaces a GitHub y demos

### 📝 Blog Técnico
- Artículos en Markdown
- Syntax highlighting con Prism.js
- Sistema de tags
- Compartir en redes sociales

### 🎨 Diseño
- Tema claro/oscuro
- Animaciones suaves
- Responsive design
- Tipografía optimizada

## 👨‍💻 Autor

**Luis Hernández (AzotoDev)** - Desarrollador Full Stack

- 🌐 Portfolio: [azotodev.com](https://azotodev.com)
- 💼 LinkedIn: [linkedin.com/in/azotodev](https://www.linkedin.com/in/azotodev/)
- 🐙 GitHub: [github.com/ManuPunk16](https://github.com/ManuPunk16)
- 🐦 X (Twitter): [@azotodev](https://x.com/azotodev)
- 📧 Email: [azzoto@icloud.com](mailto:azzoto@icloud.com)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

⭐ **¿Te gusta el proyecto? ¡Dale una estrella en GitHub!**

*Desarrollado con ❤️ usando Angular 20 y desplegado en Vercel*
