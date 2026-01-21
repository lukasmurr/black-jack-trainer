/**
 * Game Page Component - Main Blackjack game view
 */

import { Component, inject, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { GameStateService, SeoService } from '../../services';
import {
    HandComponent,
    ActionButtonsComponent,
    BettingSectionComponent,
} from '../../components';

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [
        HandComponent,
        ActionButtonsComponent,
        BettingSectionComponent,
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit {
    protected readonly gameState = inject(GameStateService);
    private readonly seoService = inject(SeoService);

    // i18n labels
    protected readonly dealerLabel = $localize`:@@game.dealer:Dealer`;
    protected readonly playerLabel = $localize`:@@game.player:Spieler`;
    protected readonly handLabel = $localize`:@@game.hand:Hand`;
    protected readonly gameDescription = $localize`:@@game.meta.description:Kostenloses Blackjack-Spiel zum Üben der Strategie`;

    ngOnInit(): void {
        // SEO Meta-Tags aktualisieren
        this.seoService.updateSeo({
            title: $localize`:@@seo.game.title:Blackjack Spiel - Kostenloser Simulator`,
            description: $localize`:@@seo.game.description:Spiele Blackjack kostenlos in unserem Simulator. Teste deine Strategie ohne Risiko und verbessere deine Fähigkeiten.`,
            keywords: $localize`:@@seo.game.keywords:Blackjack spielen, Blackjack kostenlos, Blackjack Simulator, Casino Spiel, Kartenspiel online`,
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

    getPlayerLabel(index: number): string {
        return this.gameState.playerHands().length > 1
            ? `${this.handLabel} ${index + 1}`
            : this.playerLabel;
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
