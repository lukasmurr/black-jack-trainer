/**
 * Strategie Page Component - Basic Strategy overview
 */

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

@Component({
  selector: 'app-strategie-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './strategie-page.component.html',
  styleUrl: './strategie-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategiePageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: $localize`:@@breadcrumb.home:Startseite`, url: '/' },
      { name: $localize`:@@breadcrumb.strategy:Strategie`, url: '/strategie' },
    ]);

    const article = this.seoService.getArticleSchema({
      headline: $localize`:@@strategy.seo.headline:Blackjack Strategie - Die optimale Basic Strategy`,
      description: $localize`:@@strategy.seo.articleDesc:Lerne die mathematisch optimale Blackjack-Strategie (Basic Strategy) und reduziere den Hausvorteil auf unter 0,5%.`,
      url: '/strategie',
    });

    this.seoService.updateSeo({
      title: $localize`:@@strategy.seo.title:Blackjack Strategie - Basic Strategy Tabelle & Tipps`,
      description: $localize`:@@strategy.seo.description:Die optimale Blackjack Basic Strategy: Wann Hit, Stand, Double oder Split? Reduziere den Hausvorteil mit der mathematisch besten Spielweise.`,
      keywords: $localize`:@@strategy.seo.keywords:Blackjack Strategie, Basic Strategy, Black Jack Strategie, optimale Spielweise, Blackjack Tabelle, Hausvorteil reduzieren`,
      canonicalUrl: 'https://blackjack-trainer.de/strategie',
      schema: this.seoService.getCombinedSchema([breadcrumbs, article]),
    });
  }
}
