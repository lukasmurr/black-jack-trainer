/**
 * Game Page Component - Main Blackjack game view
 */

import { Component, inject, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { GameStateService, SeoService } from '../../services';
import {
    HandComponent,
    ActionButtonsComponent,
    BettingSectionComponent,
    MessageDisplayComponent,
} from '../../components';

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [
        HandComponent,
        ActionButtonsComponent,
        BettingSectionComponent,
        MessageDisplayComponent,
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit {
    protected readonly gameState = inject(GameStateService);
    private readonly seoService = inject(SeoService);

    ngOnInit(): void {
        // SEO Meta-Tags aktualisieren
        this.seoService.updateSeo({
            title: 'Blackjack Spiel - Kostenloser Simulator',
            description: 'Spiele Blackjack kostenlos in unserem Simulator. Teste deine Strategie ohne Risiko und verbessere deine Fähigkeiten.',
            keywords: 'Blackjack spielen, Blackjack kostenlos, Blackjack Simulator, Casino Spiel, Kartenspiel online',
            canonicalUrl: 'https://blackjack-trainer.de/game',
            schema: this.seoService.getGamePageSchema(),
        });
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (this.gameState.phase() !== 'player-turn') return;

        switch (event.key.toLowerCase()) {
            case 'h':
                this.onHit();
                break;
            case 's':
                this.onStand();
                break;
            case 'd':
                this.onDouble();
                break;
            case 'p':
                this.onSplit();
                break;
        }
    }

    onBetPlaced(amount: number): void {
        this.gameState.placeBet(amount);
    }

    onHit(): void {
        this.gameState.hit();
    }

    onStand(): void {
        this.gameState.stand();
    }

    onDouble(): void {
        this.gameState.double();
    }

    onSplit(): void {
        this.gameState.split();
    }

    onNewRound(): void {
        this.gameState.initializeNewRound();
    }

    onResetBankroll(): void {
        this.gameState.resetBankroll();
    }
}
