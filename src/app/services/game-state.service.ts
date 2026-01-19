/**
 * GameStateService - Central state management for the Blackjack Trainer
 * Uses Angular Signals for reactive state management
 */

import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BlackjackService } from './blackjack.service';
import { StrategyService } from './strategy.service';
import {
    GameState,
    GamePhase,
    GameMode,
    GameResult,
    TrainingState,
    TrainingStats,
    TrainingFilter,
    PlayerAction,
    DEFAULT_BANKROLL,
    MIN_BET,
    MAX_BET,
    INITIAL_TRAINING_STATE,
    INITIAL_TRAINING_STATS,
} from '../models/game-state.model';
import { Hand, createEmptyHand } from '../models/hand.model';
import { Card } from '../models/card.model';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly blackjackService = inject(BlackjackService);
    private readonly strategyService = inject(StrategyService);

    // Core game state signals
    private readonly _mode = signal<GameMode>('training');
    private readonly _phase = signal<GamePhase>('betting');
    private readonly _deck = signal<Card[]>([]);
    private readonly _dealerHand = signal<Hand>(createEmptyHand());
    private readonly _playerHands = signal<Hand[]>([createEmptyHand()]);
    private readonly _activeHandIndex = signal(0);
    private readonly _bankroll = signal(DEFAULT_BANKROLL);
    private readonly _currentBet = signal(MIN_BET);
    private readonly _results = signal<GameResult[]>([]);
    private readonly _roundNumber = signal(0);

    // Training state signals
    private readonly _trainingState = signal<TrainingState>(INITIAL_TRAINING_STATE);

    // Message/feedback signal
    private readonly _message = signal<string>('');
    private readonly _showMessage = signal(false);

    // Public readonly signals
    readonly mode = this._mode.asReadonly();
    readonly phase = this._phase.asReadonly();
    readonly deck = this._deck.asReadonly();
    readonly dealerHand = this._dealerHand.asReadonly();
    readonly playerHands = this._playerHands.asReadonly();
    readonly activeHandIndex = this._activeHandIndex.asReadonly();
    readonly bankroll = this._bankroll.asReadonly();
    readonly currentBet = this._currentBet.asReadonly();
    readonly results = this._results.asReadonly();
    readonly roundNumber = this._roundNumber.asReadonly();
    readonly trainingState = this._trainingState.asReadonly();
    readonly message = this._message.asReadonly();
    readonly showMessage = this._showMessage.asReadonly();

    // Computed signals
    readonly activeHand = computed(() => this._playerHands()[this._activeHandIndex()]);

    readonly dealerUpCard = computed(() => {
        const hand = this._dealerHand();
        return hand.cards.find(c => c.faceUp) ?? null;
    });

    readonly dealerValue = computed(() => {
        const hand = this._dealerHand();
        return this.blackjackService.calculateHandValue(hand.cards);
    });

    readonly playerValue = computed(() => {
        const hand = this.activeHand();
        return this.blackjackService.calculateHandValue(hand.cards);
    });

    readonly canHit = computed(() => {
        const phase = this._phase();
        const hand = this.activeHand();
        return phase === 'player-turn' && !hand.isStanding && !hand.isBusted;
    });

    readonly canStand = computed(() => {
        const phase = this._phase();
        const hand = this.activeHand();
        return phase === 'player-turn' && !hand.isStanding && !hand.isBusted;
    });

    readonly canDouble = computed(() => {
        const phase = this._phase();
        const hand = this.activeHand();
        const bankroll = this._bankroll();
        return phase === 'player-turn' && this.blackjackService.canDouble(hand, bankroll);
    });

    readonly canSplit = computed(() => {
        const phase = this._phase();
        const hand = this.activeHand();
        const bankroll = this._bankroll();
        return phase === 'player-turn' && this.blackjackService.canSplit(hand, bankroll);
    });

    readonly isTrainingActive = computed(() => this._trainingState().isActive);

    readonly trainingStats = computed(() => this._trainingState().stats);

    readonly successRate = computed(() => {
        const stats = this._trainingState().stats;
        if (stats.totalAttempts === 0) return 0;
        return Math.round((stats.correctAttempts / stats.totalAttempts) * 100);
    });

    constructor() {
        // Load training stats from localStorage
        if (isPlatformBrowser(this.platformId)) {
            this.loadTrainingStats();
        }

        // Auto-save training stats
        effect(() => {
            const stats = this._trainingState().stats;
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('blackjack-training-stats', JSON.stringify(stats));
            }
        });
    }

    /**
     * Sets the game mode
     */
    setMode(mode: GameMode): void {
        this._mode.set(mode);
        if (mode === 'training') {
            this.startTraining();
        } else {
            this.stopTraining();
            this.initializeNewRound();
        }
    }

    /**
     * Initializes a new game round
     */
    initializeNewRound(): void {
        let deck = this._deck();

        // Shuffle new deck if needed (less than 52 cards remaining)
        if (deck.length < 52) {
            deck = this.blackjackService.createDeck();
        }

        this._deck.set(deck);
        this._phase.set('betting');
        this._dealerHand.set(createEmptyHand());
        this._playerHands.set([createEmptyHand()]);
        this._activeHandIndex.set(0);
        this._results.set([]);
        this._message.set('');
        this._showMessage.set(false);
    }

    /**
     * Places a bet and starts dealing
     */
    placeBet(amount: number): void {
        if (amount < MIN_BET || amount > MAX_BET) return;
        if (amount > this._bankroll()) return;

        this._currentBet.set(amount);
        this._bankroll.update(b => b - amount);
        this._roundNumber.update(r => r + 1);

        this.dealCards();
    }

    /**
     * Deals initial cards
     */
    private dealCards(): void {
        this._phase.set('dealing');

        // Check if deck needs reshuffling
        if (this._deck().length < 20) {
            const newDeck = this.blackjackService.createDeck();
            this._deck.set(newDeck);
        }

        const bet = this._currentBet();
        const result = this.blackjackService.dealInitialCards(this._deck());

        this._deck.set(result.remainingDeck);
        this._dealerHand.set({ ...result.dealerHand, bet: 0 });
        this._playerHands.set([{ ...result.playerHand, bet }]);

        // Check for blackjack
        const playerValue = this.blackjackService.calculateHandValue(result.playerHand.cards);

        if (playerValue.isBlackjack) {
            this.settlementPhase();
        } else {
            this._phase.set('player-turn');
        }
    }

    /**
     * Player hits
     */
    hit(): void {
        if (!this.canHit()) return;

        const hands = [...this._playerHands()];
        const activeIndex = this._activeHandIndex();
        const deck = this._deck();

        const result = this.blackjackService.hit(hands[activeIndex], deck);
        hands[activeIndex] = result.hand;

        this._playerHands.set(hands);
        this._deck.set(result.remainingDeck);

        if (result.hand.isBusted || result.hand.isStanding) {
            this.moveToNextHand();
        }
    }

    /**
     * Player stands
     */
    stand(): void {
        if (!this.canStand()) return;

        const hands = [...this._playerHands()];
        const activeIndex = this._activeHandIndex();

        hands[activeIndex] = this.blackjackService.stand(hands[activeIndex]);
        this._playerHands.set(hands);

        this.moveToNextHand();
    }

    /**
     * Player doubles down
     */
    double(): void {
        if (!this.canDouble()) return;

        const hands = [...this._playerHands()];
        const activeIndex = this._activeHandIndex();
        const deck = this._deck();
        const bet = hands[activeIndex].bet;

        // Deduct additional bet
        this._bankroll.update(b => b - bet);

        const result = this.blackjackService.doubleDown(hands[activeIndex], deck);
        hands[activeIndex] = result.hand;

        this._playerHands.set(hands);
        this._deck.set(result.remainingDeck);

        this.moveToNextHand();
    }

    /**
     * Player splits
     */
    split(): void {
        if (!this.canSplit()) return;

        const hands = [...this._playerHands()];
        const activeIndex = this._activeHandIndex();
        const deck = this._deck();
        const bet = hands[activeIndex].bet;

        // Deduct additional bet for split hand
        this._bankroll.update(b => b - bet);

        const result = this.blackjackService.split(hands[activeIndex], deck);

        // Replace the current hand with the two split hands
        hands.splice(activeIndex, 1, ...result.hands);

        this._playerHands.set(hands);
        this._deck.set(result.remainingDeck);
    }

    /**
     * Moves to the next hand or dealer turn
     */
    private moveToNextHand(): void {
        const hands = this._playerHands();
        const activeIndex = this._activeHandIndex();

        // Check if there are more hands to play
        const nextIndex = activeIndex + 1;
        if (nextIndex < hands.length) {
            this._activeHandIndex.set(nextIndex);
            return;
        }

        // All hands played, move to dealer turn
        this.dealerTurn();
    }

    /**
     * Plays dealer's turn
     */
    private dealerTurn(): void {
        this._phase.set('dealer-turn');

        const dealerHand = this._dealerHand();
        const deck = this._deck();

        // Check if all player hands are busted
        const allBusted = this._playerHands().every(h => h.isBusted);

        if (allBusted) {
            // Just reveal dealer cards
            const revealed: Hand = {
                ...dealerHand,
                cards: dealerHand.cards.map(c => ({ ...c, faceUp: true })),
                isStanding: true,
            };
            this._dealerHand.set(revealed);
        } else {
            // Play dealer hand
            const result = this.blackjackService.playDealerTurn(dealerHand, deck);
            this._dealerHand.set(result.hand);
            this._deck.set(result.remainingDeck);
        }

        this.settlementPhase();
    }

    /**
     * Settles all hands and determines payouts
     */
    private settlementPhase(): void {
        this._phase.set('settlement');

        const dealerHand = this._dealerHand();
        const playerHands = this._playerHands();
        const results: GameResult[] = [];

        for (const hand of playerHands) {
            const result = this.blackjackService.determineWinner(hand, dealerHand);
            results.push(result);

            // Add payout to bankroll
            this._bankroll.update(b => b + result.payout);
        }

        this._results.set(results);
        this._phase.set('game-over');

        // Show result message
        if (results.length === 1) {
            this._message.set(results[0].message);
        } else {
            const wins = results.filter(r => r.outcome === 'win' || r.outcome === 'blackjack').length;
            this._message.set(`${wins} von ${results.length} Händen gewonnen`);
        }
        this._showMessage.set(true);
    }

    // ============ Training Mode Methods ============

    /**
     * Starts training mode
     */
    startTraining(): void {
        this._trainingState.update(state => ({
            ...state,
            isActive: true,
            lastAnswer: null,
        }));
        this.generateNextScenario();
    }

    /**
     * Stops training mode
     */
    stopTraining(): void {
        this._trainingState.update(state => ({
            ...state,
            isActive: false,
            currentScenario: null,
            lastAnswer: null,
        }));
    }

    /**
     * Updates training filter
     */
    updateTrainingFilter(filter: Partial<TrainingFilter>): void {
        this._trainingState.update(state => ({
            ...state,
            filter: { ...state.filter, ...filter },
        }));
    }

    /**
     * Generates the next training scenario
     */
    generateNextScenario(): void {
        const filter = this._trainingState().filter;
        const scenario = this.strategyService.generateTrainingScenario(filter);

        if (scenario) {
            this._trainingState.update(state => ({
                ...state,
                currentScenario: scenario,
                lastAnswer: null,
            }));

            // Update display hands
            this._playerHands.set([{
                cards: scenario.playerCards,
                bet: 0,
                isDoubledDown: false,
                isSplit: false,
                isStanding: false,
                isBusted: false,
            }]);

            this._dealerHand.set({
                cards: [scenario.dealerUpCard],
                bet: 0,
                isDoubledDown: false,
                isSplit: false,
                isStanding: false,
                isBusted: false,
            });
        }
    }

    /**
     * Submits an answer in training mode
     */
    submitTrainingAnswer(action: PlayerAction): void {
        const state = this._trainingState();
        if (!state.currentScenario) return;

        const scenario = state.currentScenario;
        const wasCorrect = action === scenario.correctAction;

        // Update stats
        const stats = { ...state.stats };
        stats.totalAttempts++;

        if (wasCorrect) {
            stats.correctAttempts++;
            stats.streak++;
            if (stats.streak > stats.bestStreak) {
                stats.bestStreak = stats.streak;
            }
        } else {
            stats.streak = 0;
        }

        // Update category stats
        const categoryStats = { ...stats.byCategory };
        const category = scenario.handType;
        categoryStats[category] = {
            total: categoryStats[category].total + 1,
            correct: categoryStats[category].correct + (wasCorrect ? 1 : 0),
        };
        stats.byCategory = categoryStats;

        this._trainingState.set({
            ...state,
            stats,
            lastAnswer: {
                wasCorrect,
                playerAction: action,
                correctAction: scenario.correctAction,
                explanation: scenario.explanation,
            },
        });

        // Show feedback message
        if (wasCorrect) {
            this._message.set('✓ Richtig!');
        } else {
            this._message.set(`✗ Falsch! Richtige Antwort: ${this.actionToGerman(scenario.correctAction)}`);
        }
        this._showMessage.set(true);
    }

    /**
     * Proceeds to next training scenario
     */
    nextTrainingScenario(): void {
        this._showMessage.set(false);
        this.generateNextScenario();
    }

    /**
     * Resets training statistics
     */
    resetTrainingStats(): void {
        this._trainingState.update(state => ({
            ...state,
            stats: INITIAL_TRAINING_STATS,
        }));
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('blackjack-training-stats');
        }
    }

    /**
     * Loads training stats from localStorage
     */
    private loadTrainingStats(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        try {
            const saved = localStorage.getItem('blackjack-training-stats');
            if (saved) {
                const stats = JSON.parse(saved) as TrainingStats;
                this._trainingState.update(state => ({
                    ...state,
                    stats,
                }));
            }
        } catch {
            // Ignore parse errors
        }
    }

    /**
     * Resets bankroll to default
     */
    resetBankroll(): void {
        this._bankroll.set(DEFAULT_BANKROLL);
    }

    /**
     * Hides the current message
     */
    hideMessage(): void {
        this._showMessage.set(false);
    }

    /**
     * Translates action to German
     */
    private actionToGerman(action: PlayerAction): string {
        switch (action) {
            case 'hit': return 'Hit';
            case 'stand': return 'Stand';
            case 'double': return 'Double';
            case 'split': return 'Split';
        }
    }
}
