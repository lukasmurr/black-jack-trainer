/**
 * App Component - Root component with navigation and language switcher
 */

import { Component, inject, signal, OnInit, LOCALE_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { GameStateService, SeoService, LocaleService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly gameState = inject(GameStateService);
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  protected readonly localeService = inject(LocaleService);
  protected readonly localeId = inject(LOCALE_ID);

  protected readonly title = signal($localize`:@@app.title:Blackjack Trainer`);
  protected readonly mobileMenuOpen = signal(false);

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

  /**
   * Get URL for switching to alternate locale
   */
  getAlternateLocaleUrl(): string {
    return this.localeService.getLocaleUrl(
      this.localeService.alternateLocale,
      this.router.url
    );
  }
}
