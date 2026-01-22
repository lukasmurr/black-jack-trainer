/**
 * FAQ Page Component - Frequently asked questions with FAQPage schema
 */

import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqPageComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly faqs: FaqItem[] = [
    {
      question: 'Was ist der Unterschied zwischen „Blackjack" und „Black Jack"?',
      answer: 'Beide Schreibweisen sind korrekt und meinen dasselbe Kartenspiel. „Blackjack" (zusammen geschrieben) ist die im englischsprachigen Raum und international gebräuchlichere Variante. „Black Jack" (getrennt geschrieben) findet man häufiger im deutschsprachigen Raum. In unserem Blackjack Trainer verwenden wir beide Varianten, da viele Spieler nach beiden Begriffen suchen.',
    },
    {
      question: 'Was ist die Basic Strategy und warum sollte ich sie lernen?',
      answer: 'Die Basic Strategy ist die mathematisch optimale Spielweise für Blackjack. Sie wurde durch Computeranalysen entwickelt und sagt dir für jede Kartenkombination, ob du Hit, Stand, Double oder Split wählen solltest. Mit der Basic Strategy reduzierst du den Hausvorteil des Casinos auf unter 0,5% – das ist einer der niedrigsten Werte aller Casinospiele.',
    },
    {
      question: 'Wie zählt das Ass bei Blackjack?',
      answer: 'Das Ass ist die flexibelste Karte beim Blackjack: Es kann als 1 oder als 11 Punkte gezählt werden – je nachdem, was für deine Hand günstiger ist. Wenn du z.B. ein Ass und eine 6 hast, zählt das als Soft 17 (Ass = 11). Ziehst du dann eine 8, wird das Ass automatisch auf 1 heruntergestuft, damit du bei 15 Punkten bleibst statt bei 25 (Bust).',
    },
    {
      question: 'Wann sollte ich splitten (teilen)?',
      answer: 'Die zwei wichtigsten Regeln: Asse und Achter immer splitten, Zehner und Fünfer niemals splitten. Asse zu splitten gibt dir zwei Chancen auf einen Blackjack. Achter zu splitten verwandelt eine schwache 16 in zwei spielbare Hände. Zehner (Wert: 20) sind bereits sehr stark, und Fünfer (Wert: 10) verdoppelst du besser.',
    },
    {
      question: 'Was bedeutet „Double Down"?',
      answer: 'Beim Double Down verdoppelst du deinen Einsatz und erhältst genau eine weitere Karte. Danach musst du stehen bleiben. Diese Option ist besonders lukrativ bei 10 oder 11 Punkten, wenn der Dealer eine schwache Karte zeigt – du hast dann gute Chancen auf eine hohe Endsumme.',
    },
    {
      question: 'Ist der Blackjack Trainer kostenlos?',
      answer: 'Ja, unser Blackjack Trainer ist vollständig kostenlos. Du kannst unbegrenzt die Basic Strategy üben und im Spielmodus Blackjack spielen – ohne Registrierung und ohne echtes Geld. Es handelt sich um ein reines Übungstool ohne Glücksspiel.',
    },
    {
      question: 'Was ist der Unterschied zwischen Soft Hand und Hard Hand?',
      answer: 'Eine Soft Hand enthält ein Ass, das als 11 gezählt wird (z.B. A+7 = Soft 18). Du kannst risikofreier weitere Karten ziehen, weil das Ass bei Bedarf auf 1 heruntergestuft wird. Eine Hard Hand hat entweder kein Ass oder das Ass muss als 1 zählen. Bei Hard Hands besteht ein echtes Bust-Risiko.',
    },
    {
      question: 'Sollte ich die Insurance (Versicherung) nehmen?',
      answer: 'Nein. Die Insurance-Wette wird angeboten, wenn der Dealer ein Ass zeigt. Sie zahlt 2:1, falls der Dealer Blackjack hat. Mathematisch gesehen verlierst du langfristig Geld mit dieser Nebenwette – der Hausvorteil liegt bei über 7%. Die Basic Strategy empfiehlt: Niemals Insurance nehmen.',
    },
    {
      question: 'Kann ich mit der Basic Strategy garantiert gewinnen?',
      answer: 'Nein, auch mit perfekter Basic Strategy wirst du nicht jede Hand gewinnen. Blackjack bleibt ein Glücksspiel. Die Basic Strategy minimiert jedoch den Hausvorteil auf etwa 0,5%. Das bedeutet: Kurzfristig ist alles möglich, aber langfristig verlierst du im Durchschnitt nur 50 Cent pro 100€ Einsatz – das ist einer der fairsten Werte aller Casinospiele.',
    },
    {
      question: 'Wie kann ich die Basic Strategy am besten lernen?',
      answer: 'Am effektivsten lernst du in drei Schritten: Zuerst die Hard Hands, dann Soft Hands, dann Paare (Splits). Nutze unseren Trainingsmodus, der dir nach jeder Entscheidung sofortiges Feedback gibt. 15–20 Minuten tägliches Üben über 1–2 Wochen reichen meist aus, um die Strategie zu verinnerlichen.',
    },
  ];

  expandedIndex = signal<number | null>(null);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: 'Startseite', url: '/' },
      { name: 'FAQ', url: '/faq' },
    ]);

    const faqSchema = this.seoService.getFaqSchema(this.faqs);

    this.seoService.updateSeo({
      title: 'Blackjack FAQ – Häufige Fragen und Antworten',
      description: 'Antworten auf die häufigsten Blackjack-Fragen: Schreibweise, Basic Strategy, Ass-Regeln, Double Down, Split und mehr. Für Anfänger erklärt.',
      keywords: 'Blackjack FAQ, Black Jack Fragen, Blackjack Anfänger, Blackjack Tipps, häufige Fragen Blackjack',
      canonicalUrl: 'https://blackjack-trainer.de/faq',
      schema: this.seoService.getCombinedSchema([breadcrumbs, faqSchema]),
    });
  }

  toggleFaq(index: number): void {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex() === index;
  }
}
