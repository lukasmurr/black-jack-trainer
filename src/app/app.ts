/**
 * App Component - Root component with navigation
 */

import { Component, inject, signal, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly seoService = inject(SeoService);

  protected readonly title = signal('Blackjack Trainer');
  protected readonly mobileMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!this.shouldLoadAds()) {
        return;
      }

      // Lazy load Google Ads
      const script = this.document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2691860326275004';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onerror = () => {
        // Ad blockers can block this request; keep app behavior unaffected.
      };
      this.document.head.appendChild(script);
    });
  }

  private shouldLoadAds(): boolean {
    const hostname = this.document.location?.hostname;
    const isProductionHost = hostname === 'blackjack-trainer.de' || hostname === 'www.blackjack-trainer.de';
    const doNotTrack = this.document.defaultView?.navigator?.doNotTrack;

    return isProductionHost && doNotTrack !== '1';
  }

  ngOnInit(): void {
    // SEO-Service initialisieren für automatische Canonical-URL-Updates
    this.seoService.initialize();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
