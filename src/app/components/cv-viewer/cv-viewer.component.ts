import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import Swal from 'sweetalert2';

// Declare gtag for Google Analytics
declare let gtag: Function;

interface CVOption {
  label: string;
  flag: string;
  url: string;
  lang: 'es' | 'en';
}

interface CVAnalytics {
  lang: 'es' | 'en';
  action: 'download' | 'view';
  timestamp: number;
  userAgent: string;
}

@Component({
  selector: 'app-cv-viewer',
  imports: [CommonModule, OverlayModule],
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
        animate('200ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        }))
      ]),
      transition('open => closed', [
        animate('150ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-10px) scale(0.95)'
        })),
        style({ visibility: 'hidden' })
      ])
    ]),
    trigger('buttonPulse', [
      transition('* => pulse', [
        animate('600ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)', offset: 0.5 }),
          style({ transform: 'scale(1)', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.3)', offset: 1 })
        ]))
      ])
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0 }))
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
      label: 'Español',
      flag: '🇪🇸',
      url: '/cv/luis-hernandez-cv-es.pdf',
      lang: 'es'
    },
    {
      label: 'English',
      flag: '🇺🇸',
      url: '/cv/luis-hernandez-cv-en.pdf',
      lang: 'en'
    }
  ];

  private clickOutsideListener?: (event: Event) => void;

  ngOnInit(): void {
    setTimeout(() => {
      this.pulseState = 'pulse';
      setTimeout(() => {
        this.pulseState = '';
      }, 600);
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

    const buttonRect = this.buttonElement.nativeElement.getBoundingClientRect();

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

    this.portal = new TemplatePortal(
      this.dropdownTemplate,
      this.viewContainerRef
    );

    this.overlayRef.attach(this.portal);
    this.isDropdownOpen = true;

    this.overlayRef.backdropClick().subscribe(() => {
      this.closeDropdown();
    });

    setTimeout(() => {
      this.setupClickOutsideListener();
    }, 100);
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

    const languageResult = await Swal.fire({
      title: 'Selecciona el idioma',
      icon: 'question',
      input: 'radio',
      inputOptions: {
        'es': '🇪🇸 Español',
        'en': '🇺🇸 English'
      },
      inputValue: 'es',
      showCancelButton: true,
      confirmButtonText: 'Ver CV',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg ml-2'
      },
      buttonsStyling: false
    });

    if (languageResult.isConfirmed) {
      const selectedOption = this.cvOptions.find(opt => opt.lang === languageResult.value);
      if (selectedOption) {
        this.trackCVAnalytics(selectedOption.lang, 'view');
        await this.showPDFModal(selectedOption);
      }
    }
  }

  private async showPDFModal(option: CVOption): Promise<void> {
    const pdfUrl = option.url;

    await Swal.fire({
      title: `CV - ${option.label}`,
      html: `
        <div class="pdf-container relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
          <div id="pdf-loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p class="text-gray-600 font-medium">Cargando CV...</p>
            </div>
          </div>
          <iframe 
            id="pdf-iframe"
            src="${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1"
            class="w-full h-full border-0"
            title="CV ${option.label}"
            onload="document.getElementById('pdf-loading').style.display='none'"
            onerror="document.getElementById('pdf-loading').innerHTML='<p class=\\"text-red-500\\">Error al cargar el PDF</p>'">
          </iframe>
        </div>
        
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button 
            id="download-btn"
            class="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar PDF
          </button>
          
          <button 
            id="print-btn"
            class="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Imprimir
          </button>
          
          <button 
            id="fullscreen-btn"
            class="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            Pantalla completa
          </button>
        </div>
      `,
      width: '95%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-2xl border-0 shadow-2xl p-0 max-h-[95vh] overflow-y-auto',
        title: 'text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6 sticky top-0 bg-white z-20',
        htmlContainer: 'p-6 overflow-visible',
        closeButton: 'text-gray-400 hover:text-gray-600 text-2xl sticky top-4 right-4 z-30'
      },
      buttonsStyling: false,
      backdrop: `rgba(0,0,0,0.8)`,
      allowOutsideClick: true,
      allowEscapeKey: true,
      didOpen: () => {
        this.setupModalEventListeners(option);
      }
    });
  }

  private setupModalEventListeners(option: CVOption): void {
    const downloadBtn = document.getElementById('download-btn');
    const printBtn = document.getElementById('print-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    downloadBtn?.addEventListener('click', () => this.selectCV(option));
    printBtn?.addEventListener('click', () => this.printPDF(option.url));
    fullscreenBtn?.addEventListener('click', () => this.openFullscreen(option.url));
  }

  private printPDF(url: string): void {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    iframe?.contentWindow?.print();
  }

  private openFullscreen(url: string): void {
    window.open(url, '_blank', 'fullscreen=yes');
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
        popup: 'rounded-xl shadow-xl'
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