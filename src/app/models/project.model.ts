export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string; // Formato YYYY-MM-DD
  category: string;
}
