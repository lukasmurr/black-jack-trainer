/**
 * Spielweise Page Component - How to play Blackjack step by step
 */

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

@Component({
  selector: 'app-spielweise-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './spielweise-page.component.html',
  styleUrl: './spielweise-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpielweisePageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: $localize`:@@breadcrumb.home:Startseite`, url: '/' },
      { name: $localize`:@@breadcrumb.gameplay:Spielweise`, url: '/spielweise' },
    ]);

    const article = this.seoService.getArticleSchema({
      headline: $localize`:@@gameplay.seo.headline:Wie spielt man Blackjack? - Anleitung für Anfänger`,
      description: $localize`:@@gameplay.seo.articleDesc:Schritt-für-Schritt-Anleitung zum Blackjack spielen: Von der ersten Karte bis zur Auszahlung.`,
      url: '/spielweise',
    });

    this.seoService.updateSeo({
      title: $localize`:@@gameplay.seo.title:Wie spielt man Blackjack? Anleitung für Anfänger`,
      description: $localize`:@@gameplay.seo.description:Blackjack spielen lernen: Schritt-für-Schritt-Anleitung mit Beispielen. Hit, Stand, Double, Split - alle Aktionen erklärt.`,
      keywords: $localize`:@@gameplay.seo.keywords:Blackjack spielen, wie spielt man Blackjack, Black Jack Anleitung, Blackjack für Anfänger, 21 spielen lernen`,
      canonicalUrl: 'https://blackjack-trainer.de/spielweise',
      schema: this.seoService.getCombinedSchema([breadcrumbs, article]),
    });
  }
}
