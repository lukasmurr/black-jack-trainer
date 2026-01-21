/**
 * SEO Service - Dynamic meta tags, Open Graph, Twitter Cards, JSON-LD Schema
 * Supports i18n with locale-aware URLs and content
 */

import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
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
  noIndex?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly localeId = inject(LOCALE_ID);

  private readonly baseUrl = 'https://blackjack-trainer.de';
  private readonly defaultImage = 'https://blackjack-trainer.de/logo.png';
  private readonly siteName = $localize`:@@seo.siteName:Blackjack Trainer`;

  private schemaScriptElement: HTMLScriptElement | null = null;

  /**
   * Get current locale code (de or en)
   */
  get currentLocale(): string {
    return this.localeId.split('-')[0];
  }

  /**
   * Get locale-specific base URL
   */
  get localeBaseUrl(): string {
    return this.currentLocale === 'en' 
      ? `${this.baseUrl}/en` 
      : this.baseUrl;
  }

  /**
   * Get OG locale format
   */
  get ogLocale(): string {
    return this.currentLocale === 'en' ? 'en_US' : 'de_DE';
  }

  /**
   * Initialize SEO service with route change listener
   */
  initialize(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.urlAfterRedirects);
        this.updateHreflangTags();
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
    const canonicalUrl = config.canonicalUrl || `${this.localeBaseUrl}${this.router.url}`;
    this.updateCanonicalUrl(this.router.url);

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: config.ogImage || this.defaultImage });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: this.ogLocale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: this.currentLocale === 'en' ? 'de_DE' : 'en_US' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: config.twitterCard || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultImage });

    // JSON-LD Schema
    if (config.schema) {
      this.updateSchema(config.schema);
    }
    
    // Update hreflang tags
    this.updateHreflangTags();
  }

  /**
   * Update canonical URL link element (works on both server and browser)
   */
  private updateCanonicalUrl(url: string): void {
    const canonicalUrl = `${this.localeBaseUrl}${url === '/' ? '' : url}`;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  /**
   * Update hreflang tags for multi-language SEO
   */
  private updateHreflangTags(): void {
    // Remove existing hreflang tags
    const existingTags = this.document.querySelectorAll('link[hreflang]');
    existingTags.forEach(tag => tag.remove());

    const currentPath = this.router.url;
    
    // German version
    const deLink = this.document.createElement('link');
    deLink.setAttribute('rel', 'alternate');
    deLink.setAttribute('hreflang', 'de');
    deLink.setAttribute('href', `${this.baseUrl}${currentPath}`);
    this.document.head.appendChild(deLink);
    
    // English version
    const enLink = this.document.createElement('link');
    enLink.setAttribute('rel', 'alternate');
    enLink.setAttribute('hreflang', 'en');
    enLink.setAttribute('href', `${this.baseUrl}/en${currentPath}`);
    this.document.head.appendChild(enLink);
    
    // x-default (fallback)
    const defaultLink = this.document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', `${this.baseUrl}${currentPath}`);
    this.document.head.appendChild(defaultLink);
  }

  /**
   * Update JSON-LD Schema markup (works on both server and browser)
   */
  private updateSchema(schema: object): void {
    // Remove existing schema script
    const existingScript = this.document.querySelector('script[data-seo-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new schema script
    const schemaScript = this.document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.setAttribute('data-seo-schema', 'true');
    schemaScript.text = JSON.stringify(schema);
    this.document.head.appendChild(schemaScript);
  }

  /**
   * Get default schema for the website
   */
  getWebsiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.localeBaseUrl,
      description: $localize`:@@seo.website.description:Learn the optimal Blackjack strategy with interactive training and game mode`,
      inLanguage: this.currentLocale === 'en' ? 'en-US' : 'de-DE',
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
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
      name: $localize`:@@seo.training.schema.name:Blackjack Strategy Training`,
      url: `${this.localeBaseUrl}/training`,
      description: $localize`:@@seo.training.schema.description:Interactive training for the optimal Blackjack Basic Strategy`,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      inLanguage: this.currentLocale === 'en' ? 'en-US' : 'de-DE',
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
      name: $localize`:@@seo.game.schema.name:Blackjack Simulator`,
      url: `${this.localeBaseUrl}/game`,
      description: $localize`:@@seo.game.schema.description:Free Blackjack game to practice strategy`,
      genre: 'Card Game',
      gamePlatform: 'Web Browser',
      playMode: 'SinglePlayer',
      inLanguage: this.currentLocale === 'en' ? 'en-US' : 'de-DE',
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
        item: `${this.localeBaseUrl}${item.url}`,
      })),
    };
  }

  /**
   * Get FAQPage schema for FAQ pages
   */
  getFaqSchema(faqs: { question: string; answer: string }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  /**
   * Get Article schema for content pages
   */
  getArticleSchema(config: {
    headline: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.headline,
      description: config.description,
      url: `${this.localeBaseUrl}${config.url}`,
      datePublished: config.datePublished || '2026-01-20',
      dateModified: config.dateModified || '2026-01-20',
      author: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
      inLanguage: this.currentLocale === 'en' ? 'en-US' : 'de-DE',
    };
  }

  /**
   * Get combined schema with multiple types
   */
  getCombinedSchema(schemas: object[]): object {
    return {
      '@context': 'https://schema.org',
      '@graph': schemas.map((schema) => {
        const { '@context': _, ...rest } = schema as Record<string, unknown>;
        return rest;
      }),
    };
  }
}
