/**
 * App Routes - Navigation configuration with SEO metadata
 */

import { Routes } from '@angular/router';
import { TrainingPageComponent } from './pages/training/training-page.component';

export const routes: Routes = [
    {
        path: '',
        component: TrainingPageComponent,
        title: 'Blackjack Strategie Training',
        data: {
            description: 'Lerne die optimale Blackjack Basic Strategy mit interaktivem Training. Übe kostenlos und verbessere deine Gewinnchancen.',
        },
    },
    {
        path: 'training',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: 'game',
        loadComponent: () =>
            import('./pages/game/game-page.component').then(m => m.GamePageComponent),
        title: 'Blackjack Spiel - Kostenloser Simulator',
        data: {
            description: 'Spiele Blackjack kostenlos in unserem Simulator. Teste deine Strategie ohne Risiko.',
        },
    },
    {
        path: 'regeln',
        loadComponent: () =>
            import('./pages/regeln/regeln-page.component').then(m => m.RegelnPageComponent),
        title: 'Blackjack Regeln – Spielregeln einfach erklärt',
        data: {
            description: 'Die vollständigen Blackjack Regeln: Kartenwerte, Spielablauf, Dealer-Regeln und wann du gewinnst.',
        },
    },
    {
        path: 'spielweise',
        loadComponent: () =>
            import('./pages/spielweise/spielweise-page.component').then(m => m.SpielweisePageComponent),
        title: 'Wie spielt man Blackjack? Anleitung für Anfänger',
        data: {
            description: 'Blackjack spielen lernen: Schritt-für-Schritt-Anleitung mit Beispielen. Hit, Stand, Double, Split erklärt.',
        },
    },
    {
        path: 'kartenwerte',
        loadComponent: () =>
            import('./pages/kartenwerte/kartenwerte-page.component').then(m => m.KartenwertePageComponent),
        title: 'Blackjack Kartenwerte – Soft & Hard Hands erklärt',
        data: {
            description: 'Blackjack Kartenwerte verstehen: Wie viel zählt das Ass? Was ist Soft und Hard Hand?',
        },
    },
    {
        path: 'strategie',
        loadComponent: () =>
            import('./pages/strategie/strategie-page.component').then(m => m.StrategiePageComponent),
        title: 'Blackjack Strategie – Basic Strategy Tabelle & Tipps',
        data: {
            description: 'Die optimale Blackjack Basic Strategy: Wann Hit, Stand, Double oder Split? Hausvorteil reduzieren.',
        },
    },
    {
        path: 'glossar',
        loadComponent: () =>
            import('./pages/glossar/glossar-page.component').then(m => m.GlossarPageComponent),
        title: 'Blackjack Glossar – Begriffe von A bis Z',
        data: {
            description: 'Blackjack Begriffe erklärt: Hit, Stand, Double, Split, Bust und mehr. Das vollständige Glossar.',
        },
    },
    {
        path: 'faq',
        loadComponent: () =>
            import('./pages/faq/faq-page.component').then(m => m.FaqPageComponent),
        title: 'Blackjack FAQ – Häufige Fragen und Antworten',
        data: {
            description: 'Antworten auf die häufigsten Blackjack-Fragen: Schreibweise, Basic Strategy, Ass-Regeln und mehr.',
        },
    },
    {
        path: '**',
        redirectTo: 'training',
    },
];
