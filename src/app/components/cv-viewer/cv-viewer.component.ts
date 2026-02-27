import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, TemplateRef, ViewContainerRef } from '@angular/core';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import Swal from 'sweetalert2';

declare let gtag: Function;

interface CVOption {
  label: string;
  flag: string;
  url: string;
  lang: 'es' | 'en';
  description: string;
}

interface CVAnalytics {
  lang: 'es' | 'en';
  action: 'download' | 'view';
  timestamp: number;
  userAgent: string;
}

@Component({
  selector: 'app-cv-viewer',
  imports: [OverlayModule],
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px) scale(0.95)',
        visibility: 'hidden'
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        visibility: 'visible'
      })),
      transition('closed => open', [
        style({ visibility: 'visible' }),
        animate('200ms ease-out')
      ]),
      transition('open => closed', [
        animate('150ms ease-in'),
        style({ visibility: 'hidden' })
      ])
    ]),
    trigger('buttonPulse', [
      transition('* => pulse', [
        animate('600ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ],
  templateUrl: './cv-viewer.component.html',
  styleUrls: ['./cv-viewer.component.scss']
})
export class CvViewerComponent implements OnInit, OnDestroy {
  @ViewChild('buttonElement', { static: true }) buttonElement!: ElementRef;
  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<any>;

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  
  protected isDropdownOpen = false;
  protected pulseState = '';
  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal | null = null;

  protected cvOptions: CVOption[] = [
    {
      label: 'Español (México)',
      flag: '🇲🇽',
      url: '/cv/luis-hernandez-cv-es.pdf',
      lang: 'es',
      description: 'Versión en español'
    },
    {
      label: 'English (US)',
      flag: '🇺🇸',
      url: '/cv/luis-hernandez-cv-en.pdf',
      lang: 'en',
      description: 'English version'
    }
  ];

  private clickOutsideListener?: (event: Event) => void;

  ngOnInit(): void {
    setTimeout(() => {
      this.pulseState = 'pulse';
      setTimeout(() => this.pulseState = '', 600);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.closeDropdown();
    this.removeClickOutsideListener();
  }

  toggleDropdown(): void {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    if (!this.buttonElement) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.buttonElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    this.portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isDropdownOpen = true;

    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());

    setTimeout(() => this.setupClickOutsideListener(), 100);
  }

  closeDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.portal = null;
    }
    this.isDropdownOpen = false;
    this.removeClickOutsideListener();
  }

  selectCV(option: CVOption): void {
    const link = document.createElement('a');
    link.href = option.url;
    link.download = `luis-hernandez-cv-${option.lang}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.trackCVAnalytics(option.lang, 'download');
    this.closeDropdown();
    this.showDownloadFeedback(option.label);
  }

  async viewOnline(): Promise<void> {
    this.closeDropdown();

    const result = await Swal.fire({
      title: '📄 Visualizar Curriculum',
      html: `
        <div class="flex flex-col gap-4 p-4">
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Selecciona el idioma de tu preferencia
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${this.cvOptions.map(option => `
              <button
                data-lang="${option.lang}"
                class="cv-option-btn flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 
                       hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                       transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                       bg-white dark:bg-gray-800 dark:border-gray-600 cursor-pointer group">
                
                <span class="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  ${option.flag}
                </span>
                
                <div class="text-center">
                  <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    ${option.label}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    ${option.description}
                  </p>
                </div>

                <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium mt-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver CV
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      width: '800px',
      customClass: {
        popup: 'rounded-3xl shadow-2xl',
        htmlContainer: 'p-0',
        cancelButton: 'px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-colors duration-300'
      },
      buttonsStyling: false,
      didOpen: () => {
        const buttons = document.querySelectorAll('.cv-option-btn');
        buttons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const lang = (e.currentTarget as HTMLElement).getAttribute('data-lang') as 'es' | 'en';
            const selectedOption = this.cvOptions.find(opt => opt.lang === lang);
            if (selectedOption) {
              Swal.close();
              this.showPDFModal(selectedOption);
            }
          });
        });
      }
    });
  }

  private async showPDFModal(option: CVOption): Promise<void> {
    const pdfUrl = option.url;

    await Swal.fire({
      title: `CV - ${option.label}`,
      html: `
        <div class="flex flex-col gap-4">
          <!-- Contenedor PDF optimizado para iOS -->
          <div class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-inner"
               style="height: 70vh;">
            
            <!-- Loading spinner -->
            <div id="pdf-loading" 
                 class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-95 z-10">
              <div class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-gray-600 dark:text-gray-300 font-semibold text-lg">Cargando CV...</p>
              </div>
            </div>

            <!-- PDF Viewer optimizado -->
            <iframe 
              id="pdf-iframe"
              src="${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH"
              class="w-full h-full border-0 rounded-xl"
              title="CV ${option.label}"
              allow="fullscreen"
              style="touch-action: pan-y; -webkit-overflow-scrolling: touch;"
              onload="document.getElementById('pdf-loading').style.display='none'"
              onerror="document.getElementById('pdf-loading').innerHTML='<div class=\\"flex flex-col items-center gap-3\\"><svg class=\\"w-16 h-16 text-red-500\\" fill=\\"none\\" stroke=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"2\\" d=\\"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\\"/></svg><p class=\\"text-red-500 font-semibold\\">Error al cargar el PDF</p></div>'">
            </iframe>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-wrap justify-center gap-3 pt-4">
            <button 
              id="download-btn"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl 
                     transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Descargar
            </button>
            
            <button 
              id="open-new-tab-btn"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 
                     hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl 
                     transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Abrir en pestaña nueva
            </button>
          </div>

          <!-- Tip para dispositivos móviles -->
          <div class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p class="text-xs text-blue-700 dark:text-blue-300 text-center">
              💡 <strong>Tip móvil:</strong> Para mejor experiencia en dispositivos móviles, usa "Abrir en pestaña nueva"
            </p>
          </div>
        </div>
      `,
      width: '95%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl border-0 shadow-2xl p-6 max-h-[95vh] overflow-y-auto',
        title: 'text-2xl font-bold text-gray-800 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-700',
        htmlContainer: 'p-0 overflow-visible',
        closeButton: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl'
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.8)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      didOpen: () => {
        this.setupModalEventListeners(option);
      }
    });

    this.trackCVAnalytics(option.lang, 'view');
  }

  private setupModalEventListeners(option: CVOption): void {
    const downloadBtn = document.getElementById('download-btn');
    const openNewTabBtn = document.getElementById('open-new-tab-btn');

    downloadBtn?.addEventListener('click', () => this.selectCV(option));
    openNewTabBtn?.addEventListener('click', () => window.open(option.url, '_blank', 'noopener,noreferrer'));
  }

  private setupClickOutsideListener(): void {
    setTimeout(() => {
      this.clickOutsideListener = (event: Event) => {
        const target = event.target as HTMLElement;
        const button = this.buttonElement?.nativeElement;

        if (button && !button.contains(target)) {
          const overlayContainer = document.querySelector('.cdk-overlay-container');
          if (overlayContainer && !overlayContainer.contains(target)) {
            this.closeDropdown();
          }
        }
      };

      document.addEventListener('click', this.clickOutsideListener);
    }, 100);
  }

  private removeClickOutsideListener(): void {
    if (this.clickOutsideListener) {
      document.removeEventListener('click', this.clickOutsideListener);
      this.clickOutsideListener = undefined;
    }
  }

  private showDownloadFeedback(language: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Descarga iniciada!',
      text: `CV en ${language} descargándose...`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'bottom-end',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });
  }

  private trackCVAnalytics(lang: 'es' | 'en', action: 'download' | 'view'): void {
    const analyticsData: CVAnalytics = {
      lang,
      action,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    try {
      const existingData = JSON.parse(localStorage.getItem('cv_analytics_data') || '[]');
      const updatedData = [...existingData, analyticsData].slice(-50);
      localStorage.setItem('cv_analytics_data', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error al guardar analíticas:', error);
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', `cv_${action}`, {
        event_category: 'CV',
        event_label: lang,
        language: lang,
        action_type: action
      });
    }
  }
}