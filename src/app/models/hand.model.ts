/**
 * Hand-related types and interfaces for the Blackjack Trainer
 */

import { Card } from './card.model';

export interface Hand {
    readonly cards: readonly Card[];
    readonly bet: number;
    readonly isDoubledDown: boolean;
    readonly isSplit: boolean;
    readonly isStanding: boolean;
    readonly isBusted: boolean;
}

export interface HandValue {
    readonly hard: number;
    readonly soft: number;
    readonly isSoft: boolean;
    readonly isBlackjack: boolean;
    readonly isBusted: boolean;
    readonly display: string;
}

export type HandType = 'hard' | 'soft' | 'pair';

export interface HandAnalysis {
    readonly type: HandType;
    readonly value: number;
    readonly pairRank: string | null;
    readonly softCard: string | null;
}

// Factory functions
export function createEmptyHand(bet: number = 0): Hand {
    return {
        cards: [],
        bet,
        isDoubledDown: false,
        isSplit: false,
        isStanding: false,
        isBusted: false,
    };
}

export function addCardToHand(hand: Hand, card: Card): Hand {
    return {
        ...hand,
        cards: [...hand.cards, card],
    };
}

export function doubleDown(hand: Hand): Hand {
    return {
        ...hand,
        bet: hand.bet * 2,
        isDoubledDown: true,
    };
}

export function stand(hand: Hand): Hand {
    return {
        ...hand,
        isStanding: true,
    };
}

export function markBusted(hand: Hand): Hand {
    return {
        ...hand,
        isBusted: true,
        isStanding: true,
    };
}
