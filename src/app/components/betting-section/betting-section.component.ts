/**
 * Betting Section Component - Chip selection and bet placement
 */

import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CHIP_VALUES, MIN_BET, MAX_BET } from '../../models';

@Component({
    selector: 'app-betting-section',
    standalone: true,
    templateUrl: './betting-section.component.html',
    styleUrl: './betting-section.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BettingSectionComponent {
    readonly bankroll = input.required<number>();
    readonly betPlaced = output<number>();

    readonly chipValues = CHIP_VALUES;
    readonly minBet = MIN_BET;
    readonly maxBet = MAX_BET;

    readonly selectedChip = signal<number>(CHIP_VALUES[0]);
    readonly currentBet = signal(0);

    readonly canAddBet = computed(() => {
        const newBet = this.currentBet() + this.selectedChip();
        return newBet <= this.bankroll() && newBet <= MAX_BET;
    });

    readonly canDeal = computed(() => {
        const bet = this.currentBet();
        return bet >= MIN_BET && bet <= this.bankroll();
    });

    selectChip(value: number): void {
        this.selectedChip.set(value);
    }

    addToBet(): void {
        if (this.canAddBet()) {
            this.currentBet.update(b => b + this.selectedChip());
        }
    }

    clearBet(): void {
        this.currentBet.set(0);
    }

    placeBet(): void {
        if (this.canDeal()) {
            this.betPlaced.emit(this.currentBet());
            this.currentBet.set(0);
        }
    }
}
