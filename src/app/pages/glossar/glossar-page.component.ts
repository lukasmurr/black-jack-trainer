/**
 * Glossar Page Component - Blackjack terminology explained
 */

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
}

@Component({
  selector: 'app-glossar-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './glossar-page.component.html',
  styleUrl: './glossar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlossarPageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly terms: GlossaryTerm[] = [
    {
      term: 'Blackjack / Black Jack',
      definition: 'Das Spiel selbst und gleichzeitig die bestmögliche Hand: Ein Ass + eine 10-wertige Karte als Starthand. Wird mit 3:2 ausgezahlt. Die Schreibweisen „Blackjack" und „Black Jack" sind beide korrekt und gebräuchlich.',
    },
    {
      term: 'Hit',
      definition: 'Eine weitere Karte vom Dealer anfordern. Du kannst beliebig oft „Hit" wählen, solange du unter 21 bleibst.',
    },
    {
      term: 'Stand',
      definition: 'Mit deiner aktuellen Kartensumme stehen bleiben und keine weitere Karte ziehen. Der Dealer ist danach an der Reihe.',
    },
    {
      term: 'Double Down',
      definition: 'Deinen Einsatz verdoppeln und genau eine weitere Karte erhalten. Danach musst du automatisch stehen bleiben. Besonders lukrativ bei 10 oder 11 Punkten.',
    },
    {
      term: 'Split',
      definition: 'Ein Paar (zwei Karten mit gleichem Wert) in zwei separate Hände teilen. Du musst für die zweite Hand einen zusätzlichen Einsatz in Höhe des ursprünglichen Einsatzes bringen.',
    },
    {
      term: 'Bust',
      definition: 'Über 21 Punkte kommen. Wer „bustet", verliert sofort – egal was der Dealer hat.',
    },
    {
      term: 'Push',
      definition: 'Unentschieden zwischen Spieler und Dealer (gleiche Punktzahl). Der Einsatz wird zurückgegeben, kein Gewinn oder Verlust.',
    },
    {
      term: 'Insurance (Versicherung)',
      definition: 'Optionale Nebenwette, wenn der Dealer ein Ass zeigt. Zahlt 2:1, falls der Dealer Blackjack hat. Mathematisch ungünstig und daher nicht empfohlen.',
    },
    {
      term: 'Soft Hand',
      definition: 'Eine Hand mit einem Ass, das als 11 gezählt wird (z.B. A+6 = Soft 17). Du kannst bei einer Soft Hand risikofreier weitere Karten ziehen.',
    },
    {
      term: 'Hard Hand',
      definition: 'Eine Hand ohne Ass, oder mit einem Ass das als 1 zählen muss um unter 21 zu bleiben. Bei Hard Hands besteht ein echtes Bust-Risiko.',
    },
    {
      term: 'Upcard',
      definition: 'Die offene Karte des Dealers, die alle Spieler sehen können. Sie ist die Basis für alle strategischen Entscheidungen.',
    },
    {
      term: 'Hole Card',
      definition: 'Die verdeckte Karte des Dealers, die erst aufgedeckt wird, nachdem alle Spieler ihre Entscheidungen getroffen haben.',
    },
    {
      term: 'Natural',
      definition: 'Anderer Begriff für einen Blackjack (Ass + 10-wertige Karte als Starthand).',
    },
    {
      term: 'Shoe',
      definition: 'Der Kartenschlitten, aus dem die Karten gezogen werden. Enthält meist 6 oder 8 Kartendecks.',
    },
    {
      term: 'Bankroll',
      definition: 'Das Gesamtbudget, das du für das Spielen zur Verfügung hast. Gutes Bankroll-Management ist entscheidend für langfristigen Spielspaß.',
    },
    {
      term: 'Basic Strategy',
      definition: 'Die mathematisch optimale Spielweise für jede mögliche Kartenkombination. Reduziert den Hausvorteil auf unter 0,5%.',
    },
    {
      term: 'Hausvorteil (House Edge)',
      definition: 'Der mathematische Vorteil des Casinos. Bei Blackjack mit Basic Strategy liegt er bei ca. 0,5% – einer der niedrigsten aller Casinospiele.',
    },
    {
      term: 'Surrender',
      definition: 'In manchen Casinos erlaubt: Die Hand aufgeben und die Hälfte des Einsatzes zurückbekommen. Wird selten angeboten.',
    },
  ];

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: 'Startseite', url: '/' },
      { name: 'Glossar', url: '/glossar' },
    ]);

    const article = this.seoService.getArticleSchema({
      headline: 'Blackjack Glossar – Alle Begriffe erklärt',
      description: 'Von Hit bis Surrender: Alle wichtigen Blackjack-Begriffe einfach und verständlich erklärt.',
      url: '/glossar',
    });

    this.seoService.updateSeo({
      title: 'Blackjack Glossar – Begriffe von A bis Z',
      description: 'Blackjack Begriffe erklärt: Hit, Stand, Double, Split, Bust, Insurance und mehr. Das vollständige Glossar für Anfänger und Fortgeschrittene.',
      keywords: 'Blackjack Begriffe, Black Jack Glossar, Blackjack Wörterbuch, Hit Stand Double Split, Blackjack Fachbegriffe',
      canonicalUrl: 'https://blackjack-trainer.de/glossar',
      schema: this.seoService.getCombinedSchema([breadcrumbs, article]),
    });
  }
}
