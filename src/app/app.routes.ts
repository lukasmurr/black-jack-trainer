/**
 * App Routes - Navigation configuration with SEO metadata and i18n
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'training',
        pathMatch: 'full',
    },
    {
        path: 'training',
        loadComponent: () =>
            import('./pages/training/training-page.component').then(m => m.TrainingPageComponent),
        title: $localize`:@@route.training.title:Blackjack Strategie Training`,
        data: {
            description: $localize`:@@route.training.description:Lerne die optimale Blackjack Basic Strategy mit interaktivem Training. Übe kostenlos und verbessere deine Gewinnchancen.`,
        },
    },
    {
        path: 'game',
        loadComponent: () =>
            import('./pages/game/game-page.component').then(m => m.GamePageComponent),
        title: $localize`:@@route.game.title:Blackjack Spiel - Kostenloser Simulator`,
        data: {
            description: $localize`:@@route.game.description:Spiele Blackjack kostenlos in unserem Simulator. Teste deine Strategie ohne Risiko.`,
        },
    },
    {
        path: 'regeln',
        loadComponent: () =>
            import('./pages/regeln/regeln-page.component').then(m => m.RegelnPageComponent),
        title: $localize`:@@route.rules.title:Blackjack Regeln - Spielregeln einfach erklärt`,
        data: {
            description: $localize`:@@route.rules.description:Die vollständigen Blackjack Regeln: Kartenwerte, Spielablauf, Dealer-Regeln und wann du gewinnst.`,
        },
    },
    {
        path: 'spielweise',
        loadComponent: () =>
            import('./pages/spielweise/spielweise-page.component').then(m => m.SpielweisePageComponent),
        title: $localize`:@@route.gameplay.title:Wie spielt man Blackjack? Anleitung für Anfänger`,
        data: {
            description: $localize`:@@route.gameplay.description:Blackjack spielen lernen: Schritt-für-Schritt-Anleitung mit Beispielen. Hit, Stand, Double, Split erklärt.`,
        },
    },
    {
        path: 'kartenwerte',
        loadComponent: () =>
            import('./pages/kartenwerte/kartenwerte-page.component').then(m => m.KartenwertePageComponent),
        title: $localize`:@@route.cardValues.title:Blackjack Kartenwerte - Soft & Hard Hands erklärt`,
        data: {
            description: $localize`:@@route.cardValues.description:Blackjack Kartenwerte verstehen: Wie viel zählt das Ass? Was ist Soft und Hard Hand?`,
        },
    },
    {
        path: 'strategie',
        loadComponent: () =>
            import('./pages/strategie/strategie-page.component').then(m => m.StrategiePageComponent),
        title: $localize`:@@route.strategy.title:Blackjack Strategie - Basic Strategy Tabelle & Tipps`,
        data: {
            description: $localize`:@@route.strategy.description:Die optimale Blackjack Basic Strategy: Wann Hit, Stand, Double oder Split? Hausvorteil reduzieren.`,
        },
    },
    {
        path: 'glossar',
        loadComponent: () =>
            import('./pages/glossar/glossar-page.component').then(m => m.GlossarPageComponent),
        title: $localize`:@@route.glossary.title:Blackjack Glossar - Begriffe von A bis Z`,
        data: {
            description: $localize`:@@route.glossary.description:Blackjack Begriffe erklärt: Hit, Stand, Double, Split, Bust und mehr. Das vollständige Glossar.`,
        },
    },
    {
        path: 'faq',
        loadComponent: () =>
            import('./pages/faq/faq-page.component').then(m => m.FaqPageComponent),
        title: $localize`:@@route.faq.title:Blackjack FAQ - Häufige Fragen und Antworten`,
        data: {
            description: $localize`:@@route.faq.description:Antworten auf die häufigsten Blackjack-Fragen: Schreibweise, Basic Strategy, Ass-Regeln und mehr.`,
        },
    },
    {
        path: '**',
        redirectTo: 'training',
    },
];
