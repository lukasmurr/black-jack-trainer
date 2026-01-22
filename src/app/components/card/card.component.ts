/**
 * Card Component - Displays a single playing card with SVG support
 */

import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { Card, SUIT_SYMBOLS, SUIT_CODES } from '../../models';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NgClass, NgStyle],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    readonly card = input.required<Card>();
    readonly animate = input(false);
    readonly animationIndex = input(0);

    readonly suitSymbol = computed(() => SUIT_SYMBOLS[this.card().suit]);
    readonly suitCode = computed(() => SUIT_CODES[this.card().suit]);
    readonly isRed = computed(() =>
        this.card().suit === 'hearts' || this.card().suit === 'diamonds'
    );

    readonly animationDelay = computed(() => `${this.animationIndex() * 0.15}s`);

    readonly ariaLabel = computed(() => {
        const card = this.card();
        if (!card.faceUp) {
            return 'Verdeckte Karte';
        }
        return `${card.rank} ${this.suitToGerman(card.suit)}`;
    });

    private suitToGerman(suit: Card['suit']): string {
        switch (suit) {
            case 'hearts': return 'Herz';
            case 'diamonds': return 'Karo';
            case 'clubs': return 'Kreuz';
            case 'spades': return 'Pik';
        }
    }
}
