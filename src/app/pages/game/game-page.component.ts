/**
 * Game Page Component - Main Blackjack game view
 */

import { Component, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { GameStateService } from '../../services';
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
export class GamePageComponent {
    protected readonly gameState = inject(GameStateService);

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
