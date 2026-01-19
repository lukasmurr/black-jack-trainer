/**
 * Card-related types and interfaces for the Blackjack Trainer
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    readonly suit: Suit;
    readonly rank: Rank;
    readonly faceUp: boolean;
}

export interface CardValue {
    readonly min: number;
    readonly max: number;
}

// Mapping for card values
export const CARD_VALUES: Record<Rank, CardValue> = {
    'A': { min: 1, max: 11 },
    '2': { min: 2, max: 2 },
    '3': { min: 3, max: 3 },
    '4': { min: 4, max: 4 },
    '5': { min: 5, max: 5 },
    '6': { min: 6, max: 6 },
    '7': { min: 7, max: 7 },
    '8': { min: 8, max: 8 },
    '9': { min: 9, max: 9 },
    '10': { min: 10, max: 10 },
    'J': { min: 10, max: 10 },
    'Q': { min: 10, max: 10 },
    'K': { min: 10, max: 10 },
};

// Suit symbols for display
export const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
};

// Suit codes for SVG file names
export const SUIT_CODES: Record<Suit, string> = {
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C',
    spades: 'S',
};

// Rank codes for strategy lookup
export const RANK_TO_STRATEGY_CODE: Record<Rank, string> = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': 'T',
    'J': 'T',
    'Q': 'T',
    'K': 'T',
};

export const ALL_SUITS: readonly Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
export const ALL_RANKS: readonly Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
