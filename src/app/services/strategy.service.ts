/**
 * StrategyService - Loads and queries the blackjack strategy
 * Provides strategy recommendations for training mode
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    BlackjackStrategy,
    StrategyAction,
    DealerCard,
    STRATEGY_ACTION_MAP,
    ACTION_EXPLANATIONS,
} from '../models/strategy.model';
import { Card, RANK_TO_STRATEGY_CODE } from '../models/card.model';
import { HandAnalysis, HandType } from '../models/hand.model';
import { PlayerAction, TrainingScenario } from '../models/game-state.model';

@Injectable({
    providedIn: 'root',
})
export class StrategyService {
    private readonly strategyPath = 'blackjack_strategy.json';
    private strategy = signal<BlackjackStrategy | null>(null);
    private loadError = signal<string | null>(null);

    readonly isLoaded = computed(() => this.strategy() !== null);
    readonly error = computed(() => this.loadError());

    private strategyCache$: Observable<BlackjackStrategy> | null = null;

    constructor(private http: HttpClient) { }

    /**
     * Loads the strategy JSON file
     */
    loadStrategy(): Observable<BlackjackStrategy> {
        if (this.strategyCache$) {
            return this.strategyCache$;
        }

        this.strategyCache$ = this.http.get<BlackjackStrategy>(this.strategyPath).pipe(
            tap(strategy => {
                this.strategy.set(strategy);
                this.loadError.set(null);
            }),
            catchError(error => {
                const message = `Failed to load strategy: ${error.message}`;
                this.loadError.set(message);
                console.error(message);
                throw error;
            }),
            shareReplay(1)
        );

        return this.strategyCache$;
    }

    /**
     * Gets the recommended action for a hand
     */
    getRecommendedAction(
        handAnalysis: HandAnalysis,
        dealerUpCard: Card,
        canDouble: boolean = true,
        canSplit: boolean = true
    ): PlayerAction | null {
        const strat = this.strategy();
        if (!strat) return null;

        const dealerCode = RANK_TO_STRATEGY_CODE[dealerUpCard.rank] as DealerCard;
        let strategyAction: StrategyAction | undefined;

        switch (handAnalysis.type) {
            case 'pair':
                if (handAnalysis.pairRank) {
                    const pairStrategy = strat.pair_splitting[handAnalysis.pairRank];
                    if (pairStrategy && typeof pairStrategy !== 'string') {
                        strategyAction = pairStrategy[dealerCode];
                    }
                }
                break;

            case 'soft':
                if (handAnalysis.softCard) {
                    const softKey = `A${handAnalysis.softCard}`;
                    const softStrategy = strat.soft_hands[softKey];
                    if (softStrategy && typeof softStrategy !== 'string') {
                        strategyAction = softStrategy[dealerCode];
                    }
                }
                break;

            case 'hard':
                const hardStrategy = strat.hard_hands[String(handAnalysis.value)];
                if (hardStrategy && typeof hardStrategy !== 'string') {
                    strategyAction = hardStrategy[dealerCode];
                }
                break;
        }

        if (!strategyAction) return null;

        return this.resolveAction(strategyAction, canDouble, canSplit);
    }

    /**
     * Resolves a strategy action code to a player action
     */
    private resolveAction(
        action: StrategyAction,
        canDouble: boolean,
        canSplit: boolean
    ): PlayerAction {
        const mapping = STRATEGY_ACTION_MAP[action];

        // Handle split actions
        if (mapping.primary === 'split') {
            if (canSplit) return 'split';
            return mapping.fallback ?? 'hit';
        }

        // Handle double actions
        if (mapping.primary === 'double') {
            if (canDouble) return 'double';
            return mapping.fallback ?? 'hit';
        }

        return mapping.primary;
    }

    /**
     * Gets the explanation for an action
     */
    getActionExplanation(action: StrategyAction): string {
        return ACTION_EXPLANATIONS[action] ?? 'Unbekannte Aktion';
    }

    /**
     * Generates a random training scenario
     */
    generateTrainingScenario(
        filter: { hardHands: boolean; softHands: boolean; pairs: boolean }
    ): TrainingScenario | null {
        const strat = this.strategy();
        if (!strat) return null;

        const availableTypes: HandType[] = [];
        if (filter.hardHands) availableTypes.push('hard');
        if (filter.softHands) availableTypes.push('soft');
        if (filter.pairs) availableTypes.push('pair');

        if (availableTypes.length === 0) return null;

        const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const dealerCards: DealerCard[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];
        const dealerCode = dealerCards[Math.floor(Math.random() * dealerCards.length)];

        let playerCards: Card[];
        let correctAction: PlayerAction;
        let explanation: string;

        switch (selectedType) {
            case 'hard': {
                const hardHands = Object.keys(strat.hard_hands).filter(
                    k => k !== 'description' && parseInt(k) >= 5 && parseInt(k) <= 17
                );
                const handValue = hardHands[Math.floor(Math.random() * hardHands.length)];
                const strategy = strat.hard_hands[handValue];

                if (typeof strategy === 'string') return null;

                const actionCode = strategy[dealerCode];
                playerCards = this.createHardHand(parseInt(handValue));
                correctAction = this.resolveAction(actionCode, true, false);
                explanation = this.getActionExplanation(actionCode);
                break;
            }

            case 'soft': {
                const softHands = Object.keys(strat.soft_hands).filter(k => k !== 'description');
                const softKey = softHands[Math.floor(Math.random() * softHands.length)];
                const strategy = strat.soft_hands[softKey];

                if (typeof strategy === 'string') return null;

                const actionCode = strategy[dealerCode];
                playerCards = this.createSoftHand(softKey);
                correctAction = this.resolveAction(actionCode, true, false);
                explanation = this.getActionExplanation(actionCode);
                break;
            }

            case 'pair': {
                const pairRanks = Object.keys(strat.pair_splitting).filter(k => k !== 'description');
                const pairRank = pairRanks[Math.floor(Math.random() * pairRanks.length)];
                const strategy = strat.pair_splitting[pairRank];

                if (typeof strategy === 'string') return null;

                const actionCode = strategy[dealerCode];
                playerCards = this.createPairHand(pairRank);
                correctAction = this.resolveAction(actionCode, true, true);
                explanation = this.getActionExplanation(actionCode);
                break;
            }

            default:
                return null;
        }

        const dealerUpCard = this.createDealerCard(dealerCode);

        return {
            playerCards,
            dealerUpCard,
            correctAction,
            handType: selectedType,
            explanation,
        };
    }

    /**
     * Creates a hard hand of a specific value
     */
    private createHardHand(value: number): Card[] {
        const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
        const randomSuit = () => suits[Math.floor(Math.random() * suits.length)];

        // Common card combinations for hard hands
        if (value <= 11) {
            const card1Value = Math.min(value - 2, 10);
            const card2Value = value - card1Value;
            return [
                { rank: this.valueToRank(card1Value), suit: randomSuit(), faceUp: true },
                { rank: this.valueToRank(card2Value), suit: randomSuit(), faceUp: true },
            ];
        }

        // For values 12-17, use 10 + (value - 10)
        const remainder = value - 10;
        return [
            { rank: '10', suit: randomSuit(), faceUp: true },
            { rank: this.valueToRank(remainder), suit: randomSuit(), faceUp: true },
        ];
    }

    /**
     * Creates a soft hand (A + other card)
     */
    private createSoftHand(softKey: string): Card[] {
        const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
        const randomSuit = () => suits[Math.floor(Math.random() * suits.length)];

        // softKey is like "A2", "A7", etc.
        const otherCard = softKey.substring(1);
        const otherRank = this.strategyCodeToRank(otherCard);

        return [
            { rank: 'A', suit: randomSuit(), faceUp: true },
            { rank: otherRank, suit: randomSuit(), faceUp: true },
        ];
    }

    /**
     * Creates a pair hand
     */
    private createPairHand(pairRank: string): Card[] {
        const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
        const shuffled = [...suits].sort(() => Math.random() - 0.5);
        const rank = this.strategyCodeToRank(pairRank);

        return [
            { rank, suit: shuffled[0], faceUp: true },
            { rank, suit: shuffled[1], faceUp: true },
        ];
    }

    /**
     * Creates a dealer up card
     */
    private createDealerCard(dealerCode: DealerCard): Card {
        const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const rank = this.strategyCodeToRank(dealerCode);

        return { rank, suit: randomSuit, faceUp: true };
    }

    /**
     * Converts a numeric value to a card rank
     */
    private valueToRank(value: number): Card['rank'] {
        if (value === 1) return 'A';
        if (value >= 2 && value <= 9) return String(value) as Card['rank'];
        if (value === 10) return '10';
        throw new Error(`Invalid card value: ${value}`);
    }

    /**
     * Converts a strategy code to a card rank
     */
    private strategyCodeToRank(code: string): Card['rank'] {
        if (code === 'T') {
            const faceCards: Card['rank'][] = ['10', 'J', 'Q', 'K'];
            return faceCards[Math.floor(Math.random() * faceCards.length)];
        }
        if (code === 'A') return 'A';
        return code as Card['rank'];
    }

    /**
     * Validates if the player's action matches the strategy
     */
    validateAction(
        playerAction: PlayerAction,
        handAnalysis: HandAnalysis,
        dealerUpCard: Card,
        canDouble: boolean = true,
        canSplit: boolean = true
    ): { isCorrect: boolean; correctAction: PlayerAction; explanation: string } {
        const correctAction = this.getRecommendedAction(
            handAnalysis,
            dealerUpCard,
            canDouble,
            canSplit
        );

        if (!correctAction) {
            return {
                isCorrect: false,
                correctAction: playerAction,
                explanation: 'Strategie konnte nicht ermittelt werden',
            };
        }

        const isCorrect = playerAction === correctAction;
        const strat = this.strategy();

        // Get detailed explanation
        let explanation: string;
        if (isCorrect) {
            explanation = 'Richtig! Das ist die optimale Spielweise.';
        } else {
            explanation = `Die optimale Aktion wäre: ${this.actionToGerman(correctAction)}`;
        }

        return { isCorrect, correctAction, explanation };
    }

    /**
     * Translates action to German
     */
    private actionToGerman(action: PlayerAction): string {
        switch (action) {
            case 'hit': return 'Hit (Karte nehmen)';
            case 'stand': return 'Stand (Stehen bleiben)';
            case 'double': return 'Double (Verdoppeln)';
            case 'split': return 'Split (Teilen)';
        }
    }
}
