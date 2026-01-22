/**
 * Strategy types for loading and parsing the blackjack_strategy.json
 */

export type StrategyAction = 'H' | 'S' | 'D' | 'Dh' | 'Ds' | 'P' | 'Ph' | 'Ps';

export type DealerCard = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'A';

export interface ActionDescriptions {
    readonly H: string;
    readonly S: string;
    readonly D: string;
    readonly Dh: string;
    readonly Ds: string;
    readonly P: string;
    readonly Ph: string;
    readonly Ps: string;
}

export type DealerCardStrategy = Record<DealerCard, StrategyAction>;

export interface HardHandsStrategy {
    readonly description: string;
    readonly [handValue: string]: DealerCardStrategy | string;
}

export interface SoftHandsStrategy {
    readonly description: string;
    readonly [handKey: string]: DealerCardStrategy | string;
}

export interface PairSplittingStrategy {
    readonly description: string;
    readonly [pairRank: string]: DealerCardStrategy | string;
}

export interface DealerUpcardInfo {
    readonly [card: string]: string;
}

export interface StrategyNotes {
    readonly card_values: string;
    readonly color_legend: string;
    readonly rules: string;
}

export interface BlackjackStrategy {
    readonly strategy_name: string;
    readonly description: string;
    readonly actions: ActionDescriptions;
    readonly hard_hands: HardHandsStrategy;
    readonly soft_hands: SoftHandsStrategy;
    readonly pair_splitting: PairSplittingStrategy;
    readonly dealer_upcard: DealerUpcardInfo;
    readonly notes: StrategyNotes;
}

// Mapping from strategy action codes to player actions
export const STRATEGY_ACTION_MAP: Record<StrategyAction, { primary: 'hit' | 'stand' | 'double' | 'split'; fallback?: 'hit' | 'stand' }> = {
    'H': { primary: 'hit' },
    'S': { primary: 'stand' },
    'D': { primary: 'double' },
    'Dh': { primary: 'double', fallback: 'hit' },
    'Ds': { primary: 'double', fallback: 'stand' },
    'P': { primary: 'split' },
    'Ph': { primary: 'split', fallback: 'hit' },
    'Ps': { primary: 'split', fallback: 'stand' },
};

export const ACTION_EXPLANATIONS: Record<StrategyAction, string> = {
    'H': 'Hit - Nimm eine weitere Karte',
    'S': 'Stand - Keine weitere Karte nehmen',
    'D': 'Double Down - Einsatz verdoppeln und genau eine Karte nehmen',
    'Dh': 'Double wenn möglich, sonst Hit',
    'Ds': 'Double wenn möglich, sonst Stand',
    'P': 'Split - Paar teilen',
    'Ph': 'Split wenn möglich, sonst Hit',
    'Ps': 'Split wenn möglich, sonst Stand',
};
