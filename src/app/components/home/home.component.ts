import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, OnDestroy, ViewChild, Inject, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MetaService } from '../../services/meta.service';
import { CvViewerComponent } from '../cv-viewer/cv-viewer.component';

// Interfaces
interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Skill {
  name: string;
  level: number;
}

interface TechIcon {
  name: string;
  icon: string;
  color: string;
  viewBox?: string;
  path: string;
}

interface Experience {
  id: number;
  position: string;
  company: string;
  companyLogo: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface SocialLink {
  name: string;
  url: string;
  icon: string; // Mantener para compatibilidad
  svg: string;  // Nuevo campo para SVG
}

interface ContactMethod {
  type: string;
  label: string;
  value: string;
  action: string;
  icon: string;
  color: string;
  svg: string;
}

interface Stat {
  label: string;
  value: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface Achievement {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}

interface ProfessionalValue {
  title: string;
  description: string;
}

interface PersonalInterest {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CvViewerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;
  @ViewChild('typewriterText') typewriterText!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;

  // Animation properties
  particles: Particle[] = [];
  logoParticles: Particle[] = [];
  animatedSkills = false;
  devText = '<dev/>';
  
  // Typewriter properties mejoradas
  private typewriterRoles = [
    'Full Stack Developer',
    'Angular Specialist', 
    'Frontend Expert',
    'Backend Developer',
    'Tech Lead',
    'Digital Innovator'
  ];
  private currentRoleIndex = 0;
  private typewriterInterval?: any;
  private isTyping = false;
  private currentText = '';

  // Skills data
  frontendSkills: Skill[] = [
    { name: 'Angular', level: 95 },
    { name: 'React', level: 85 },
    { name: 'Vue.js', level: 80 },
    { name: 'TypeScript', level: 90 },
    { name: 'JavaScript', level: 88 },
    { name: 'HTML5/CSS3', level: 92 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'Bootstrap', level: 82 },
    { name: 'SASS/SCSS', level: 82 },
    { name: 'Webpack', level: 75 }
  ];

  backendSkills: Skill[] = [
    { name: 'Node.js', level: 85 },
    { name: 'Express.js', level: 80 },
    { name: 'NestJS', level: 75 },
    { name: 'Python', level: 70 },
    { name: 'Java', level: 60 },
    { name: 'Spring Boot', level: 55 },
    { name: 'MongoDB', level: 82 },
    { name: 'PostgreSQL', level: 78 },
    { name: 'MySQL', level: 78 },
    { name: 'REST APIs', level: 88 },
    { name: 'Microservices', level: 65 }
  ];

  toolsSkills: Skill[] = [
    { name: 'Git/GitHub', level: 90 },
    { name: 'Windows Server', level: 75 },
    { name: 'Google Cloud', level: 65 },
    { name: 'Firebase', level: 80 },
    { name: 'Linux', level: 75 },
    { name: 'VS Code', level: 81 },
    { name: 'Postman', level: 68 },
    { name: 'Trello', level: 62 },
    { name: 'GitHub Actions', level: 75 }
  ];

  // Tech icons with floating animation
  floatingTechs: TechIcon[] = [
    { name: 'Angular', icon: 'assets/icons/angular.svg', color: '#DD0031', path: 'M9.93 12.645h4.134L11.996 7.74 M11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z' },
    { name: 'TypeScript', icon: 'assets/icons/typescript.svg', color: '#3178C6', path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z' },
    { name: 'Node.js', icon: 'assets/icons/nodejs.svg', color: '#339933', path: 'M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z' },
    { name: 'MongoDB', icon: 'assets/icons/mongodb.svg', color: '#47A248', path: 'M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z' }
  ];

  // All technologies for cloud
  allTechnologies: TechIcon[] = [
    {
      name: 'Angular', 
      color: '#DD0031', 
      path: 'M9.93 12.645h4.134L11.996 7.74M11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z',
      icon: ''
    },
    {
      name: 'React', 
      color: '#61DAFB', 
      path: 'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.102-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.471 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.346-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.076 2.917c-.403-.148-.77-.301-1.104-.48-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.014 1.36-.034-.44.572-.895 1.095-1.36 1.56-.465-.467-.92-.988-1.36-1.56z',
      icon: ''
    },
    {
      name: 'Vue.js', 
      color: '#4FC08D', 
      path: 'M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z',
      icon: ''
    },
    {
      name: 'TypeScript', 
      color: '#3178C6', 
      path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
      icon: ''
    },
    {
      name: 'JavaScript', 
      color: '#F7DF1E', 
      path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.004zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z',
      icon: ''
    },
    {
      name: 'Python', 
      color: '#3776AB', 
      path: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z',
      icon: ''
    },
    {
      name: 'HTML5', 
      color: '#E34F26', 
      path: 'M1.5 0h21v24h-21zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z',
      icon: ''
    },
    {
      name: 'CSS3', 
      color: '#1572B6', 
      path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z',
      icon: ''
    },
    {
      name: 'Bootstrap', 
      color: '#7952B3', 
      path: 'M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z',
      icon: ''
    },
    {
      name: 'Node.js', 
      color: '#339933', 
      path: 'M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z',
      icon: ''
    },
    {
      name: 'Express.js', 
      color: '#000000', 
      path: 'M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z',
      icon: ''
    },
    {
      name: 'MongoDB', 
      color: '#47A248', 
      path: 'M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z',
      icon: ''
    },
    {
      name: 'Git', 
      color: '#F05032', 
      path: 'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187',
      icon: ''
    },
    {
      name: 'Tailwind CSS', 
      color: '#06B6D4', 
      path: 'M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 18.418 9.027 19.8 12.001 19.8c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C14.337 13.982 12.976 12.6 10.001 12.6z',
      icon: ''
    }
  ];

  // Experience timeline
  experiences: Experience[] = [
    {
      id: 1,
      position: 'Senior Full Stack Developer',
      company: 'Consejería Jurídica del Gobierno del Estado de Campeche',
      companyLogo: 'assets/imgs/cj-logo.png',
      period: '2020 - Presente',
      location: 'Campeche, México',
      description: 'Desarrollo de sistemas gubernamentales de alta complejidad y gran escala para la administración pública.',
      achievements: [
        'Lideré el desarrollo de 5+ sistemas críticos para la administración pública',
        'Implementé arquitecturas escalables que soportan 10,000+ usuarios concurrentes',
        'Reduje tiempos de desarrollo en 40% mediante metodologías ágiles',
        'Mejoré la accesibilidad web alcanzando estándares WCAG 2.1 AA'
      ],
      technologies: ['Angular', 'TypeScript', 'Node.js', 'MongoDB', 'Express.js', 'Firebase']
    },
    {
      id: 2,
      position: 'Frontend Developer',
      company: 'Freelance Projects',
      companyLogo: 'assets/imgs/freelance-logo.png',
      period: '2019 - 2020',
      location: 'Remoto',
      description: 'Desarrollo de aplicaciones web modernas para diversos clientes internacionales.',
      achievements: [
        'Desarrollé 15+ proyectos para clientes en 8 países diferentes',
        'Implementé responsive design y performance optimization',
        'Logré 98+ scores en Google Lighthouse consistentemente',
        'Establecí workflows de CI/CD que redujeron deployment time en 60%'
      ],
      technologies: ['Angular', 'React', 'Vue.js', 'TypeScript', 'SASS', 'Webpack']
    },
    {
      id: 3,
      position: 'Junior Web Developer',
      company: 'TechStart Solutions',
      companyLogo: 'assets/imgs/techstart-logo.png',
      period: '2018 - 2019',
      location: 'Mérida, Yucatán',
      description: 'Desarrollo de sitios web y aplicaciones para startups locales y PYMES.',
      achievements: [
        'Contribuí al desarrollo de 8 aplicaciones web exitosas',
        'Implementé integraciones con APIs de terceros (Stripe, PayPal, etc.)',
        'Optimicé SEO logrando mejoras del 150% en rankings de búsqueda',
        'Mentoreé a 3 desarrolladores junior en mejores prácticas'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'WordPress']
    }
  ];

  // Social links con íconos SVG seguros
  socialLinks: SocialLink[] = [
    { 
      name: 'GitHub', 
      url: 'https://github.com/manupunk16', 
      icon: 'fab fa-github',
      svg: '' // Vamos a usar SVGs inline en el template
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com/in/azotodev/', 
      icon: 'fab fa-linkedin',
      svg: ''
    },
    // { 
    //   name: 'Twitter', 
    //   url: 'https://twitter.com/azottodev', 
    //   icon: 'fab fa-twitter',
    //   svg: ''
    // },
    { 
      name: 'Email', 
      url: 'mailto:azzoto@icloud.com', 
      icon: 'fas fa-envelope',
      svg: ''
    }
  ];

  // Contact methods con íconos seguros
  contactMethods: ContactMethod[] = [
    {
      type: 'email',
      label: 'Email',
      value: 'azzoto@icloud.com',
      action: 'Enviar email',
      icon: 'fas fa-envelope',
      color: '#EA4335',
      svg: `
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
        </svg>
      `
    },
    // {
    //   type: 'whatsapp',
    //   label: 'WhatsApp',
    //   value: '+52 981 123 4567',
    //   action: 'Enviar mensaje',
    //   icon: 'fab fa-whatsapp',
    //   color: '#25D366',
    //   svg: `
    //     <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    //       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    //     </svg>
    //   `
    // },
    {
      type: 'telegram',
      label: 'Telegram',
      value: '@azotodev',
      action: 'Abrir chat',
      icon: 'fab fa-telegram',
      color: '#0088CC',
      svg: `
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      `
    },
    {
      type: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/azotodev/',
      action: 'Ver perfil',
      icon: 'fab fa-linkedin',
      color: '#0A66C2',
      svg: `
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      `
    }
  ];

  // Stats
  stats: Stat[] = [
    { label: 'Proyectos', value: '10+' },
    { label: 'Experiencia', value: '5+ años' },
    // { label: 'Clientes', value: '15+' },
    { label: 'Commits', value: '1,200+' }
  ];

  // Portfolio stats
  portfolioStats: Stat[] = [
    { label: 'Proyectos Completados', value: '10+' },
    { label: 'Líneas de Código', value: '20K+' },
    { label: 'Commits', value: '1,200+' },
    { label: 'Horas de Desarrollo', value: '5,000+' }
  ];

  // Quick links
  quickLinks: QuickLink[] = [
    { label: 'Inicio', href: '#home' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Artículos', href: '/articles' },
    { label: 'Contacto', href: '#contact' }
  ];

  // Portfolio metadata
  portfolioVersion = '2.1.0';
  angularVersion = '20.0';
  lastUpdate = new Date();
  currentYear = new Date().getFullYear();

  // Nuevas propiedades para la sección About Me
  professionalAchievements: Achievement[] = [
    {
      title: 'Años de Experiencia',
      value: '5+',
      description: 'En desarrollo web profesional',
      icon: 'fas fa-calendar-alt',
      color: '#3B82F6'
    },
    {
      title: 'Proyectos Completados',
      value: '50+',
      description: 'Aplicaciones web exitosas',
      icon: 'fas fa-project-diagram',
      color: '#10B981'
    },
    {
      title: 'Usuarios Impactados',
      value: '10k+',
      description: 'A través de mis aplicaciones',
      icon: 'fas fa-users',
      color: '#8B5CF6'
    },
    {
      title: 'Tecnologías Dominadas',
      value: '15+',
      description: 'Frameworks y herramientas',
      icon: 'fas fa-cogs',
      color: '#F59E0B'
    }
  ];

  professionalValues: ProfessionalValue[] = [
    {
      title: 'Calidad ante todo',
      description: 'Escribo código limpio, escalable y mantenible siguiendo las mejores prácticas.'
    },
    {
      title: 'Aprendizaje continuo',
      description: 'Me mantengo actualizado con las últimas tecnologías y tendencias del desarrollo.'
    },
    {
      title: 'Colaboración efectiva',
      description: 'Trabajo bien en equipo y comunico ideas técnicas de manera clara.'
    },
    {
      title: 'Enfoque en el usuario',
      description: 'Desarrollo pensando en la experiencia del usuario final y la accesibilidad.'
    },
    {
      title: 'Soluciones innovadoras',
      description: 'Busco enfoques creativos para resolver problemas técnicos complejos.'
    }
  ];

  personalInterests: PersonalInterest[] = [
    { name: 'Fotografía', icon: 'fas fa-camera', color: '#EF4444' },
    { name: 'Lectura Técnica', icon: 'fas fa-book', color: '#3B82F6' },
    { name: 'Gaming', icon: 'fas fa-gamepad', color: '#8B5CF6' },
    { name: 'Música', icon: 'fas fa-music', color: '#10B981' },
    { name: 'Viajes', icon: 'fas fa-plane', color: '#F59E0B' },
    { name: 'Fitness', icon: 'fas fa-dumbbell', color: '#EF4444' }
  ];

  // Lazy import for CV Viewer
  private cdr = inject(ChangeDetectorRef);
  cvViewerLoaded = false;
  cvViewerComponent: any = null;
  showCVLoader = false;
  isPreloading!: boolean;

  constructor(
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.metaService.updateMeta(this.metaService.generateHomeMeta());
    
    this.generateParticles();
    this.generateLogoParticles();
    if (isPlatformBrowser(this.platformId)) {
      this.startTypewriterImproved();
    }
  }

  ngAfterViewInit() {
    this.animateElements();
    
    // Start skills animation after delay
    setTimeout(() => {
      this.animatedSkills = true;
    }, 1000);

    // Preload CV Viewer component after 2 seconds
    setTimeout(() => {
      this.preloadCVViewer();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  // Generate random particles
  private generateParticles(): void {
    this.particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 8
    }));
  }

  // Generate logo particles
  private generateLogoParticles(): void {
    this.logoParticles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1,
      delay: Math.random() * 4
    }));
  }

  // Typewriter effect mejorado
  private startTypewriterImproved(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const typeText = (text: string, index: number = 0) => {
      if (index <= text.length) {
        this.currentText = text.substring(0, index);
        if (this.typewriterText?.nativeElement) {
          this.typewriterText.nativeElement.textContent = this.currentText;
        }
        setTimeout(() => typeText(text, index + 1), 100); // Velocidad de tipeo
      } else {
        // Pausa después de completar el texto
        setTimeout(() => {
          eraseText(text.length);
        }, 2000);
      }
    };

    const eraseText = (index: number) => {
      if (index >= 0) {
        const currentRole = this.typewriterRoles[this.currentRoleIndex];
        this.currentText = currentRole.substring(0, index);
        if (this.typewriterText?.nativeElement) {
          this.typewriterText.nativeElement.textContent = this.currentText;
        }
        setTimeout(() => eraseText(index - 1), 50); // Velocidad de borrado
      } else {
        // Cambiar al siguiente rol
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.typewriterRoles.length;
        setTimeout(() => {
          typeText(this.typewriterRoles[this.currentRoleIndex]);
        }, 500); // Pausa antes del siguiente texto
      }
    };

    // Iniciar con el primer texto
    typeText(this.typewriterRoles[this.currentRoleIndex]);
  }

  // Animate elements on scroll
  animateElements(): void {
    this.animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.nativeElement.classList.add('opacity-100', 'translate-y-0');
        element.nativeElement.classList.remove('opacity-0', 'translate-y-8');
      }, 200 * index);
    });
  }

  // Get floating tech position
  getTechPosition(index: number): string {
    const angle = (index * (360 / this.floatingTechs.length));
    const radius = 160;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return `translate(${x}px, ${y}px)`;
  }

  // Actions
  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  downloadCV(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Create download link
      const link = document.createElement('a');
      link.href = 'assets/cv/Luis_Hernandez_CV.pdf';
      link.download = 'Luis_Hernandez_CV.pdf';
      link.click();
    }
  }

  scheduleCall(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://calendly.com/azottodev', '_blank');
    }
  }

  showTechInfo(tech: TechIcon): void {
    // Implement modal or tooltip with tech info
    // console.log(`Info about ${tech.name}`);
  }

  showTechTooltip(tech: TechIcon, event: MouseEvent): void {
    // Implement tooltip functionality
  }

  hideTechTooltip(): void {
    // Hide tooltip
  }

  openContact(contact: ContactMethod): void {
    if (!isPlatformBrowser(this.platformId)) return;

    switch (contact.type) {
      case 'email':
        window.open(`mailto:${contact.value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${contact.value.replace(/\s+/g, '')}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/${contact.value.replace('@', '')}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://${contact.value}`, '_blank');
        break;
    }
  }

  // Lazy load CV Viewer when user clicks
  async loadCVViewer() {
    if (this.cvViewerLoaded) {
      return; // Ya está cargado
    }
    
    if (this.showCVLoader) {
      return; // Ya está cargando
    }
    
    this.showCVLoader = true;
    this.cdr.detectChanges();
    
    try {
      // Dynamic import con timeout para mejor UX
      const modulePromise = import('../cv-viewer/cv-viewer.component');
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500)); // Mínimo 500ms para mostrar loading
      
      const [module] = await Promise.all([modulePromise, timeoutPromise]);
      
      const CVViewerComponent = module.CvViewerComponent;
      this.cvViewerComponent = CVViewerComponent;
      this.cvViewerLoaded = true;
      
      // Trigger change detection
      this.cdr.detectChanges();
      
      // console.log('✅ CV Viewer cargado exitosamente');
      
    } catch (error) {
      // console.error('❌ Error loading CV Viewer component:', error);
      this.showFallbackMessage();
    } finally {
      this.showCVLoader = false;
      this.cdr.detectChanges();
    }
  }

  // Preload in background for better UX (silent)
  private async preloadCVViewer() {
    if (this.cvViewerLoaded || this.isPreloading) {
      return;
    }
    
    this.isPreloading = true;
    
    try {
      // console.log('🔄 Precargando CV Viewer en background...');
      
      const module = await import('../cv-viewer/cv-viewer.component');
      const CVViewerComponent = module.CvViewerComponent;
      this.cvViewerComponent = CVViewerComponent;
      this.cvViewerLoaded = true;
      
      this.cdr.detectChanges();
      // console.log('✅ CV Viewer precargado exitosamente');
      
    } catch (error) {
      console.debug('⚠️ CV Viewer preload failed (no crítico):', error);
    } finally {
      this.isPreloading = false;
    }
  }

  // Fallback para errores de carga
  private showFallbackMessage() {
    // Usar SweetAlert2 o un toast para mostrar error
    console.warn('Funcionalidad temporalmente no disponible');
  }

  // Method to trigger CV viewer functionality manually
  async triggerCVAction() {
    if (!this.cvViewerLoaded) {
      await this.loadCVViewer();
    }
    
    if (this.cvViewerLoaded) {
      // console.log('CV Viewer listo para usar');
    }
  }
}
