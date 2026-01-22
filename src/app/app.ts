/**
 * App Component - Root component with navigation
 */

import { Component, inject, signal, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GameStateService, SeoService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly gameState = inject(GameStateService);
  private readonly seoService = inject(SeoService);

  protected readonly title = signal('Blackjack Trainer');
  protected readonly mobileMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      // Lazy load Google Ads
      const script = this.document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2691860326275004';
      script.async = true;
      script.crossOrigin = 'anonymous';
      this.document.head.appendChild(script);
    });
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
