/**
 * SEO Service - Dynamic meta tags, Open Graph, Twitter Cards, JSON-LD Schema
 */

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: object;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly baseUrl = 'https://blackjack-trainer.de';
  private readonly defaultImage = 'https://blackjack-trainer.de/icons/icon-512x512.png';
  private readonly siteName = 'Blackjack Trainer';

  private schemaScriptElement: HTMLScriptElement | null = null;

  /**
   * Initialize SEO service with route change listener
   */
  initialize(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.urlAfterRedirects);
      });
  }

  /**
   * Update all SEO meta tags for a page
   */
  updateSeo(config: SeoConfig): void {
    // Title
    this.title.setTitle(`${config.title} | ${this.siteName}`);

    // Basic Meta Tags
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Robots
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Canonical URL
    const canonicalUrl = config.canonicalUrl || `${this.baseUrl}${this.router.url}`;
    this.updateCanonicalUrl(this.router.url);

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: config.ogImage || this.defaultImage });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: config.twitterCard || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultImage });

    // JSON-LD Schema
    if (config.schema) {
      this.updateSchema(config.schema);
    }
  }

  /**
   * Update canonical URL link element
   */
  private updateCanonicalUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canonicalUrl = `${this.baseUrl}${url === '/' ? '' : url}`;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  /**
   * Update JSON-LD Schema markup
   */
  private updateSchema(schema: object): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing schema script
    if (this.schemaScriptElement) {
      this.schemaScriptElement.remove();
    }

    // Create new schema script
    this.schemaScriptElement = this.document.createElement('script');
    this.schemaScriptElement.type = 'application/ld+json';
    this.schemaScriptElement.text = JSON.stringify(schema);
    this.document.head.appendChild(this.schemaScriptElement);
  }

  /**
   * Get default schema for the website
   */
  getWebsiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      description: 'Lerne die optimale Blackjack-Strategie mit interaktivem Training und Spielmodus',
      inLanguage: 'de-DE',
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/icons/icon-512x512.png`,
        },
      },
    };
  }

  /**
   * Get schema for the training page
   */
  getTrainingPageSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Blackjack Strategie Training',
      url: `${this.baseUrl}/training`,
      description: 'Interaktives Training für die optimale Blackjack Basic Strategy',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    };
  }

  /**
   * Get schema for the game page
   */
  getGamePageSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Blackjack Simulator',
      url: `${this.baseUrl}/game`,
      description: 'Kostenloses Blackjack-Spiel zum Üben der Strategie',
      genre: 'Card Game',
      gamePlatform: 'Web Browser',
      playMode: 'SinglePlayer',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
    };
  }

  /**
   * Get BreadcrumbList schema
   */
  getBreadcrumbSchema(items: { name: string; url: string }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`,
      })),
    };
  }
}
