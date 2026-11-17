import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, stagger } from 'animejs';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animationType: 'fade-up' | 'stagger-cards' | 'scale-in' = 'fade-up';
  @Input() staggerSelector: string = '';
  @Input() delay: number = 0;
  @Input() duration: number = 650;

  private observer?: IntersectionObserver;
  private hasAnimated = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.el.nativeElement.style.opacity = '1';
      this.el.nativeElement.style.transform = 'none';
      return;
    }

    // Setup initial state on target elements
    this.prepareElements();

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.runAnimation();
            this.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private prepareElements(): void {
    if (this.staggerSelector) {
      const items = this.el.nativeElement.querySelectorAll<HTMLElement>(this.staggerSelector);
      items.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(24px)';
        item.style.willChange = 'opacity, transform';
      });
    } else {
      this.el.nativeElement.style.opacity = '0';
      this.el.nativeElement.style.transform = this.animationType === 'scale-in' ? 'scale(0.95)' : 'translateY(24px)';
      this.el.nativeElement.style.willChange = 'opacity, transform';
    }
  }

  private runAnimation(): void {
    if (this.staggerSelector) {
      const targets = this.el.nativeElement.querySelectorAll(this.staggerSelector);
      if (targets.length > 0) {
        animate(targets, {
          opacity: [0, 1],
          translateY: [24, 0],
          delay: stagger(60, { start: this.delay }),
          duration: this.duration,
          ease: 'outQuad',
          onComplete: () => {
            targets.forEach((node) => {
              (node as HTMLElement).style.willChange = 'auto';
            });
          }
        });
      }
    } else {
      const isScale = this.animationType === 'scale-in';
      animate(this.el.nativeElement, {
        opacity: [0, 1],
        translateY: isScale ? [0, 0] : [24, 0],
        scale: isScale ? [0.95, 1] : [1, 1],
        delay: this.delay,
        duration: this.duration,
        ease: 'outQuad',
        onComplete: () => {
          this.el.nativeElement.style.willChange = 'auto';
        }
      });
    }
  }

  private disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
