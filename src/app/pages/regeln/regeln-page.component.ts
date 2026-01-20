/**
 * Regeln Page Component - Blackjack Rules explanation
 */

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

@Component({
  selector: 'app-regeln-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './regeln-page.component.html',
  styleUrl: './regeln-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegelnPageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: 'Startseite', url: '/' },
      { name: 'Blackjack Regeln', url: '/regeln' },
    ]);

    const article = this.seoService.getArticleSchema({
      headline: 'Blackjack Regeln – So funktioniert das Kartenspiel',
      description: 'Lerne die offiziellen Blackjack Regeln: Kartenwerte, Spielablauf, Dealer-Regeln und Gewinnbedingungen einfach erklärt.',
      url: '/regeln',
    });

    this.seoService.updateSeo({
      title: 'Blackjack Regeln – Spielregeln einfach erklärt',
      description: 'Die vollständigen Blackjack Regeln: Kartenwerte, Spielablauf, Dealer-Regeln und wann du gewinnst. Für Anfänger verständlich erklärt.',
      keywords: 'Blackjack Regeln, Black Jack Regeln, Blackjack Spielregeln, Kartenspiel Regeln, 21 Regeln',
      canonicalUrl: 'https://blackjack-trainer.de/regeln',
      schema: this.seoService.getCombinedSchema([breadcrumbs, article]),
    });
  }
}
