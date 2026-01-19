/**
 * Game state types and interfaces for the Blackjack Trainer
 */

import { Card } from './card.model';
import { Hand } from './hand.model';

export type GamePhase =
    | 'betting'      // Waiting for bet
    | 'dealing'      // Cards being dealt
    | 'player-turn'  // Player making decisions
    | 'dealer-turn'  // Dealer playing
    | 'settlement'   // Determining winners
    | 'game-over';   // Round complete

export type GameMode = 'play' | 'training';

export type PlayerAction = 'hit' | 'stand' | 'double' | 'split';

export interface GameResult {
    readonly outcome: 'win' | 'lose' | 'push' | 'blackjack';
    readonly payout: number;
    readonly message: string;
}

export interface GameState {
    readonly mode: GameMode;
    readonly phase: GamePhase;
    readonly deck: readonly Card[];
    readonly dealerHand: Hand;
    readonly playerHands: readonly Hand[];
    readonly activeHandIndex: number;
    readonly bankroll: number;
    readonly currentBet: number;
    readonly results: readonly GameResult[];
    readonly roundNumber: number;
}

export interface TrainingState {
    readonly isActive: boolean;
    readonly currentScenario: TrainingScenario | null;
    readonly filter: TrainingFilter;
    readonly stats: TrainingStats;
    readonly lastAnswer: TrainingAnswer | null;
}

export interface TrainingScenario {
    readonly playerCards: readonly Card[];
    readonly dealerUpCard: Card;
    readonly correctAction: PlayerAction;
    readonly handType: 'hard' | 'soft' | 'pair';
    readonly explanation: string;
}

export interface TrainingFilter {
    readonly hardHands: boolean;
    readonly softHands: boolean;
    readonly pairs: boolean;
}

export interface TrainingStats {
    readonly totalAttempts: number;
    readonly correctAttempts: number;
    readonly streak: number;
    readonly bestStreak: number;
    readonly byCategory: {
        readonly hard: CategoryStats;
        readonly soft: CategoryStats;
        readonly pair: CategoryStats;
    };
}

export interface CategoryStats {
    readonly total: number;
    readonly correct: number;
}

export interface TrainingAnswer {
    readonly wasCorrect: boolean;
    readonly playerAction: PlayerAction;
    readonly correctAction: PlayerAction;
    readonly explanation: string;
}

// Initial states
export const INITIAL_TRAINING_STATS: TrainingStats = {
    totalAttempts: 0,
    correctAttempts: 0,
    streak: 0,
    bestStreak: 0,
    byCategory: {
        hard: { total: 0, correct: 0 },
        soft: { total: 0, correct: 0 },
        pair: { total: 0, correct: 0 },
    },
};

export const INITIAL_TRAINING_FILTER: TrainingFilter = {
    hardHands: true,
    softHands: true,
    pairs: true,
};

export const INITIAL_TRAINING_STATE: TrainingState = {
    isActive: false,
    currentScenario: null,
    filter: INITIAL_TRAINING_FILTER,
    stats: INITIAL_TRAINING_STATS,
    lastAnswer: null,
};

export const DEFAULT_BANKROLL = 1000;
export const MIN_BET = 10;
export const MAX_BET = 500;
export const CHIP_VALUES = [10, 25, 50, 100, 500] as const;
