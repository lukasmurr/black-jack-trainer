/**
 * Custom Title Strategy for SEO-optimized page titles
 * Works with SSR/Prerendering to set titles server-side
 */

import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly siteName = 'Blackjack Trainer';

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    
    if (title) {
      // Format: "Page Title | Site Name" or just "Site Name" for home
      this.title.setTitle(title === this.siteName ? title : `${title} | ${this.siteName}`);
    } else {
      // Fallback to site name
      this.title.setTitle(this.siteName);
    }
  }
}
