export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
  isMain?: boolean;
}

export interface ProjectMetrics {
  users?: number;
  performance?: string;
  uptime?: string;
  responseTime?: string;
  architecture?: string;
}

export interface ProjectTeam {
  size: number;
  role: string;
  duration: string;
  responsibilities?: string[];
}

export interface TechnicalModule {
  name: string;
  description: string;
}

export interface KeyMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  
  // Sistema de imágenes mejorado
  imageUrl: string; // Imagen principal
  previewLabel?: string;
  gallery: ProjectImage[]; // Galería de capturas
  
  // Información técnica
  technologies: string[];
  features: string[];
  technicalModules?: TechnicalModule[];
  keyMetrics?: KeyMetric[];
  
  // Clasificación y estado
  category: string;
  status: 'completed' | 'in-progress' | 'maintenance' | 'archived';
  privacy: 'public' | 'private' | 'internal';
  
  // URLs opcionales
  demoUrl?: string;
  repoUrl?: string;
  
  // Metadatos
  featured: boolean;
  date: string;
  lastUpdated?: string;
  
  // Información adicional
  team: ProjectTeam;
  metrics?: ProjectMetrics;
  challenges?: string[];
  results?: string[];
  learnings?: string[];
  tags?: string[];
  
  // Flags para presentación
  hasScreenshots: boolean;
  isResponsive: boolean;
  hasDocumentation: boolean;
  
  // Enriquecimiento de Negocio & UX (Steve Krug)
  role?: string;
  impact?: string;
  businessProblem?: string;
}
