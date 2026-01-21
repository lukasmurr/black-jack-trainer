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
      question: $localize`:@@faq.q1.question:Was ist der Unterschied zwischen „Blackjack" und „Black Jack"?`,
      answer: $localize`:@@faq.q1.answer:Beide Schreibweisen sind korrekt und meinen dasselbe Kartenspiel. „Blackjack" (zusammen geschrieben) ist die im englischsprachigen Raum und international gebräuchlichere Variante. „Black Jack" (getrennt geschrieben) findet man häufiger im deutschsprachigen Raum. In unserem Blackjack Trainer verwenden wir beide Varianten, da viele Spieler nach beiden Begriffen suchen.`,
    },
    {
      question: $localize`:@@faq.q2.question:Was ist die Basic Strategy und warum sollte ich sie lernen?`,
      answer: $localize`:@@faq.q2.answer:Die Basic Strategy ist die mathematisch optimale Spielweise für Blackjack. Sie wurde durch Computeranalysen entwickelt und sagt dir für jede Kartenkombination, ob du Hit, Stand, Double oder Split wählen solltest. Mit der Basic Strategy reduzierst du den Hausvorteil des Casinos auf unter 0,5% - das ist einer der niedrigsten Werte aller Casinospiele.`,
    },
    {
      question: $localize`:@@faq.q3.question:Wie zählt das Ass bei Blackjack?`,
      answer: $localize`:@@faq.q3.answer:Das Ass ist die flexibelste Karte beim Blackjack: Es kann als 1 oder als 11 Punkte gezählt werden - je nachdem, was für deine Hand günstiger ist. Wenn du z.B. ein Ass und eine 6 hast, zählt das als Soft 17 (Ass = 11). Ziehst du dann eine 8, wird das Ass automatisch auf 1 heruntergestuft, damit du bei 15 Punkten bleibst statt bei 25 (Bust).`,
    },
    {
      question: $localize`:@@faq.q4.question:Wann sollte ich splitten (teilen)?`,
      answer: $localize`:@@faq.q4.answer:Die zwei wichtigsten Regeln: Asse und Achter immer splitten, Zehner und Fünfer niemals splitten. Asse zu splitten gibt dir zwei Chancen auf einen Blackjack. Achter zu splitten verwandelt eine schwache 16 in zwei spielbare Hände. Zehner (Wert: 20) sind bereits sehr stark, und Fünfer (Wert: 10) verdoppelst du besser.`,
    },
    {
      question: $localize`:@@faq.q5.question:Was bedeutet „Double Down"?`,
      answer: $localize`:@@faq.q5.answer:Beim Double Down verdoppelst du deinen Einsatz und erhältst genau eine weitere Karte. Danach musst du stehen bleiben. Diese Option ist besonders lukrativ bei 10 oder 11 Punkten, wenn der Dealer eine schwache Karte zeigt - du hast dann gute Chancen auf eine hohe Endsumme.`,
    },
    {
      question: $localize`:@@faq.q6.question:Ist der Blackjack Trainer kostenlos?`,
      answer: $localize`:@@faq.q6.answer:Ja, unser Blackjack Trainer ist vollständig kostenlos. Du kannst unbegrenzt die Basic Strategy üben und im Spielmodus Blackjack spielen - ohne Registrierung und ohne echtes Geld. Es handelt sich um ein reines Übungstool ohne Glücksspiel.`,
    },
    {
      question: $localize`:@@faq.q7.question:Was ist der Unterschied zwischen Soft Hand und Hard Hand?`,
      answer: $localize`:@@faq.q7.answer:Eine Soft Hand enthält ein Ass, das als 11 gezählt wird (z.B. A+7 = Soft 18). Du kannst risikofreier weitere Karten ziehen, weil das Ass bei Bedarf auf 1 heruntergestuft wird. Eine Hard Hand hat entweder kein Ass oder das Ass muss als 1 zählen. Bei Hard Hands besteht ein echtes Bust-Risiko.`,
    },
    {
      question: $localize`:@@faq.q8.question:Sollte ich die Insurance (Versicherung) nehmen?`,
      answer: $localize`:@@faq.q8.answer:Nein. Die Insurance-Wette wird angeboten, wenn der Dealer ein Ass zeigt. Sie zahlt 2:1, falls der Dealer Blackjack hat. Mathematisch gesehen verlierst du langfristig Geld mit dieser Nebenwette - der Hausvorteil liegt bei über 7%. Die Basic Strategy empfiehlt: Niemals Insurance nehmen.`,
    },
    {
      question: $localize`:@@faq.q9.question:Kann ich mit der Basic Strategy garantiert gewinnen?`,
      answer: $localize`:@@faq.q9.answer:Nein, auch mit perfekter Basic Strategy wirst du nicht jede Hand gewinnen. Blackjack bleibt ein Glücksspiel. Die Basic Strategy minimiert jedoch den Hausvorteil auf etwa 0,5%. Das bedeutet: Kurzfristig ist alles möglich, aber langfristig verlierst du im Durchschnitt nur 50 Cent pro 100€ Einsatz - das ist einer der fairsten Werte aller Casinospiele.`,
    },
    {
      question: $localize`:@@faq.q10.question:Wie kann ich die Basic Strategy am besten lernen?`,
      answer: $localize`:@@faq.q10.answer:Am effektivsten lernst du in drei Schritten: Zuerst die Hard Hands, dann Soft Hands, dann Paare (Splits). Nutze unseren Trainingsmodus, der dir nach jeder Entscheidung sofortiges Feedback gibt. 15-20 Minuten tägliches Üben über 1-2 Wochen reichen meist aus, um die Strategie zu verinnerlichen.`,
    },
  ];

  expandedIndex = signal<number | null>(null);

  ngOnInit(): void {
    const breadcrumbs = this.seoService.getBreadcrumbSchema([
      { name: $localize`:@@breadcrumb.home:Startseite`, url: '/' },
      { name: $localize`:@@breadcrumb.faq:FAQ`, url: '/faq' },
    ]);

    const faqSchema = this.seoService.getFaqSchema(this.faqs);

    this.seoService.updateSeo({
      title: $localize`:@@faq.seo.title:Blackjack FAQ - Häufige Fragen und Antworten`,
      description: $localize`:@@faq.seo.description:Antworten auf die häufigsten Blackjack-Fragen: Schreibweise, Basic Strategy, Ass-Regeln, Double Down, Split und mehr. Für Anfänger erklärt.`,
      keywords: $localize`:@@faq.seo.keywords:Blackjack FAQ, Black Jack Fragen, Blackjack Anfänger, Blackjack Tipps, häufige Fragen Blackjack`,
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
