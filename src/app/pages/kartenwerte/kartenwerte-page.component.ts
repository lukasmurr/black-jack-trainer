/**
 * Kartenwerte Page Component - Card values, soft/hard hands explained
 */

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

@Component({
  selector: 'app-kartenwerte-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './kartenwerte-page.component.html',
  styleUrl: './kartenwerte-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KartenwertePageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: 'Startseite', url: '/' },
      { name: 'Kartenwerte', url: '/kartenwerte' },
    ]);

    const article = this.seoService.getArticleSchema({
      headline: 'Blackjack Kartenwerte – Soft Hands, Hard Hands & Ass-Regeln',
      description: 'Alle Kartenwerte bei Blackjack erklärt: Wie zählt das Ass? Was sind Soft und Hard Hands?',
      url: '/kartenwerte',
    });

    this.seoService.updateSeo({
      title: 'Blackjack Kartenwerte – Soft & Hard Hands erklärt',
      description: 'Blackjack Kartenwerte verstehen: Wie viel zählt das Ass? Was ist der Unterschied zwischen Soft und Hard Hand? Alle Werte im Überblick.',
      keywords: 'Blackjack Kartenwerte, Soft Hand, Hard Hand, Blackjack Ass, Black Jack Punkte, Kartenzählen Werte',
      canonicalUrl: 'https://blackjack-trainer.de/kartenwerte',
      schema: this.seoService.getCombinedSchema([breadcrumbs, article]),
    });
  }
}
