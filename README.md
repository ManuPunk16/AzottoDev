# 🌟 AzottoDev - Portfolio Personal

> Portfolio profesional desarrollado con Angular 20, TypeScript y Tailwind CSS

[![Demo Live](https://img.shields.io/badge/Demo-Live-success)](https://azotodev.web.app)
[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)

## 🎨 Características

- ⚡ **Angular 20** con Standalone Components
- 🎭 **Tema dual** (claro/oscuro) con persistencia
- 📱 **100% Responsive** con Tailwind CSS
- 🔍 **SEO Optimizado** con meta tags dinámicos
- 📊 **Performance** 95+ en Lighthouse
- 🖼️ **Galería de proyectos** con modal interactivo
- 🎯 **TypeScript** estricto
- 🚀 **PWA** completa

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 20, TypeScript, Tailwind CSS
- **Hosting**: Firebase Hosting
- **Build**: Angular CLI + esbuild
- **Styling**: SCSS + CSS Variables para temas

## 🚀 Demo Live

👉 **[Ver Portfolio](https://azotodev.web.app)**

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes standalone
│   ├── services/       # Servicios (metadata, sitemap)
│   ├── models/         # Interfaces TypeScript
│   └── app.routes.ts   # Routing configuration
├── assets/
│   ├── projects.json   # Datos de proyectos
│   ├── projects/       # JSONs individuales para SEO
│   └── images/         # Imágenes optimizadas WebP
└── styles.scss         # Sistema de temas CSS
```

## 💻 Desarrollo Local

```bash
# Clonar e instalar
git clone https://github.com/azottodev/portfolio.git
cd portfolio
npm install

# Desarrollo
npm start  # Puerto 4400

# Build de producción
npm run build:prod
```

## 🎯 Características Técnicas Destacadas

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

### Componentes Standalone
```typescript
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ...
})
```

### SEO Optimizado
- Meta tags dinámicos por proyecto
- Sitemap automático
- Open Graph completo
- Schema.org JSON-LD

## 📈 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 👨‍💻 Autor

**Luis Hernández** - Desarrollador Full Stack
- 🌐 Portfolio: [azotodev.web.app](https://azotodev.web.app)
- 💼 LinkedIn: [linkedin.com/in/azotodev](https://linkedin.com/in/azotodev)
- 📧 Email: azzoto@icloud.com

---

⭐ **¿Te gusta el proyecto? ¡Dale una estrella!**

*Desarrollado con ❤️ usando Angular 20*
