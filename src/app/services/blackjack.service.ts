/**
 * BlackjackService - Core game logic for Blackjack
 * Handles deck management, card dealing, hand evaluation, and game rules
 */

import { Injectable, computed, signal } from '@angular/core';
import {
    Card,
    Rank,
    Suit,
    ALL_RANKS,
    ALL_SUITS,
    CARD_VALUES,
    RANK_TO_STRATEGY_CODE,
} from '../models/card.model';
import {
    Hand,
    HandValue,
    HandAnalysis,
    createEmptyHand,
    addCardToHand,
    markBusted,
    stand,
    doubleDown,
} from '../models/hand.model';

@Injectable({
    providedIn: 'root',
})
export class BlackjackService {
    private readonly numberOfDecks = signal(6);

    /**
     * Creates a fresh shuffled deck
     */
    createDeck(deckCount: number = this.numberOfDecks()): Card[] {
        const deck: Card[] = [];

        for (let d = 0; d < deckCount; d++) {
            for (const suit of ALL_SUITS) {
                for (const rank of ALL_RANKS) {
                    deck.push({
                        suit,
                        rank,
                        faceUp: true,
                    });
                }
            }
        }

        return this.shuffleDeck(deck);
    }

    /**
     * Fisher-Yates shuffle algorithm
     */
    shuffleDeck(deck: Card[]): Card[] {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Draws a card from the deck
     */
    drawCard(deck: Card[], faceUp: boolean = true): { card: Card; remainingDeck: Card[] } {
        if (deck.length === 0) {
            throw new Error('Deck is empty');
        }

        const [drawnCard, ...remainingDeck] = deck;
        const card: Card = { ...drawnCard, faceUp };

        return { card, remainingDeck };
    }

    /**
     * Calculates the value of a hand
     */
    calculateHandValue(cards: readonly Card[]): HandValue {
        const visibleCards = cards.filter(card => card.faceUp);

        let hardValue = 0;
        let aceCount = 0;

        for (const card of visibleCards) {
            const value = CARD_VALUES[card.rank];
            hardValue += value.min;
            if (card.rank === 'A') {
                aceCount++;
            }
        }

        // Calculate soft value (counting one Ace as 11 if possible)
        let softValue = hardValue;
        if (aceCount > 0 && hardValue + 10 <= 21) {
            softValue = hardValue + 10;
        }

        const isSoft = softValue !== hardValue && softValue <= 21;
        const isBlackjack = visibleCards.length === 2 && softValue === 21;
        const isBusted = hardValue > 21;

        // Display string
        let display: string;
        if (isBusted) {
            display = `${hardValue} (Bust)`;
        } else if (isBlackjack) {
            display = 'Blackjack!';
        } else if (isSoft) {
            display = `${softValue}`;
        } else {
            display = `${hardValue}`;
        }

        return {
            hard: hardValue,
            soft: softValue,
            isSoft,
            isBlackjack,
            isBusted,
            display,
        };
    }

    /**
     * Analyzes a hand for strategy lookup
     */
    analyzeHand(cards: readonly Card[]): HandAnalysis {
        if (cards.length < 2) {
            return { type: 'hard', value: 0, pairRank: null, softCard: null };
        }

        const visibleCards = cards.filter(c => c.faceUp);

        // Check for pair (first two cards same rank)
        if (visibleCards.length === 2) {
            const card1Value = RANK_TO_STRATEGY_CODE[visibleCards[0].rank];
            const card2Value = RANK_TO_STRATEGY_CODE[visibleCards[1].rank];

            if (card1Value === card2Value) {
                return {
                    type: 'pair',
                    value: this.calculateHandValue(visibleCards).soft,
                    pairRank: card1Value,
                    softCard: null,
                };
            }
        }

        // Check for soft hand (Ace counted as 11)
        const hasAce = visibleCards.some(c => c.rank === 'A');
        const handValue = this.calculateHandValue(visibleCards);

        if (hasAce && handValue.isSoft && visibleCards.length === 2) {
            const otherCard = visibleCards.find(c => c.rank !== 'A');
            return {
                type: 'soft',
                value: handValue.soft,
                pairRank: null,
                softCard: otherCard ? RANK_TO_STRATEGY_CODE[otherCard.rank] : null,
            };
        }

        // Hard hand
        return {
            type: 'hard',
            value: handValue.isSoft ? handValue.soft : handValue.hard,
            pairRank: null,
            softCard: null,
        };
    }

    /**
     * Deals initial cards for a new round
     */
    dealInitialCards(deck: Card[]): {
        playerHand: Hand;
        dealerHand: Hand;
        remainingDeck: Card[];
    } {
        let currentDeck = deck;
        let playerHand = createEmptyHand();
        let dealerHand = createEmptyHand();

        // Deal: Player, Dealer, Player, Dealer (face down)
        const draw1 = this.drawCard(currentDeck, true);
        playerHand = addCardToHand(playerHand, draw1.card);
        currentDeck = draw1.remainingDeck;

        const draw2 = this.drawCard(currentDeck, true);
        dealerHand = addCardToHand(dealerHand, draw2.card);
        currentDeck = draw2.remainingDeck;

        const draw3 = this.drawCard(currentDeck, true);
        playerHand = addCardToHand(playerHand, draw3.card);
        currentDeck = draw3.remainingDeck;

        const draw4 = this.drawCard(currentDeck, false); // Dealer hole card face down
        dealerHand = addCardToHand(dealerHand, draw4.card);
        currentDeck = draw4.remainingDeck;

        return {
            playerHand,
            dealerHand,
            remainingDeck: currentDeck,
        };
    }

    /**
     * Processes a hit action
     */
    hit(hand: Hand, deck: Card[]): { hand: Hand; remainingDeck: Card[] } {
        const { card, remainingDeck } = this.drawCard(deck, true);
        let updatedHand = addCardToHand(hand, card);

        const value = this.calculateHandValue(updatedHand.cards);
        if (value.isBusted) {
            updatedHand = markBusted(updatedHand);
        }

        return { hand: updatedHand, remainingDeck };
    }

    /**
     * Processes a stand action
     */
    stand(hand: Hand): Hand {
        return stand(hand);
    }

    /**
     * Processes a double down action
     */
    doubleDown(hand: Hand, deck: Card[]): { hand: Hand; remainingDeck: Card[] } {
        const doubled = doubleDown(hand);
        const { hand: finalHand, remainingDeck } = this.hit(doubled, deck);
        return { hand: stand(finalHand), remainingDeck };
    }

    /**
     * Processes a split action
     */
    split(hand: Hand, deck: Card[]): { hands: Hand[]; remainingDeck: Card[] } {
        if (hand.cards.length !== 2) {
            throw new Error('Can only split a two-card hand');
        }

        const [card1, card2] = hand.cards;
        const originalBet = hand.bet;
        let currentDeck = deck;

        // Create two new hands
        let hand1 = createEmptyHand(originalBet);
        hand1 = addCardToHand(hand1, card1);
        const draw1 = this.drawCard(currentDeck, true);
        hand1 = addCardToHand(hand1, draw1.card);
        currentDeck = draw1.remainingDeck;

        let hand2 = createEmptyHand(originalBet);
        hand2 = addCardToHand(hand2, card2);
        const draw2 = this.drawCard(currentDeck, true);
        hand2 = addCardToHand(hand2, draw2.card);
        currentDeck = draw2.remainingDeck;

        return {
            hands: [
                { ...hand1, isSplit: true },
                { ...hand2, isSplit: true },
            ],
            remainingDeck: currentDeck,
        };
    }

    /**
     * Checks if a hand can be split
     */
    canSplit(hand: Hand, bankroll: number): boolean {
        if (hand.cards.length !== 2) return false;
        if (hand.isSplit) return false; // Already split
        if (bankroll < hand.bet) return false; // Not enough money

        const [card1, card2] = hand.cards;
        return RANK_TO_STRATEGY_CODE[card1.rank] === RANK_TO_STRATEGY_CODE[card2.rank];
    }

    /**
     * Checks if a hand can double down
     */
    canDouble(hand: Hand, bankroll: number): boolean {
        if (hand.cards.length !== 2) return false;
        if (hand.isDoubledDown) return false;
        if (bankroll < hand.bet) return false;
        return true;
    }

    /**
     * Plays the dealer's turn according to standard rules
     * Dealer hits on 16 or less, stands on 17 or more
     */
    playDealerTurn(dealerHand: Hand, deck: Card[]): { hand: Hand; remainingDeck: Card[] } {
        // First, flip the hole card
        let hand: Hand = {
            ...dealerHand,
            cards: dealerHand.cards.map(card => ({ ...card, faceUp: true })),
        };

        let currentDeck = deck;

        while (true) {
            const value = this.calculateHandValue(hand.cards);

            if (value.isBusted) {
                return { hand: markBusted(hand), remainingDeck: currentDeck };
            }

            // Dealer stands on 17 or higher
            if (value.soft >= 17) {
                return { hand: stand(hand), remainingDeck: currentDeck };
            }

            // Dealer hits
            const result = this.hit(hand, currentDeck);
            hand = result.hand;
            currentDeck = result.remainingDeck;
        }
    }

    /**
     * Determines the winner and calculates payout
     */
    determineWinner(
        playerHand: Hand,
        dealerHand: Hand
    ): { outcome: 'win' | 'lose' | 'push' | 'blackjack'; payout: number; message: string } {
        const playerValue = this.calculateHandValue(playerHand.cards);
        const dealerValue = this.calculateHandValue(dealerHand.cards);

        // Player busted
        if (playerValue.isBusted) {
            return {
                outcome: 'lose',
                payout: 0,
                message: 'Bust! Du hast verloren.',
            };
        }

        // Player has blackjack
        if (playerValue.isBlackjack && !playerHand.isSplit) {
            if (dealerValue.isBlackjack) {
                return {
                    outcome: 'push',
                    payout: playerHand.bet,
                    message: 'Beide Blackjack - Unentschieden!',
                };
            }
            return {
                outcome: 'blackjack',
                payout: playerHand.bet * 2.5, // 3:2 payout
                message: 'Blackjack! Gewinn 3:2!',
            };
        }

        // Dealer has blackjack (and player doesn't, otherwise caught above)
        if (dealerValue.isBlackjack) {
            return {
                outcome: 'lose',
                payout: 0,
                message: 'Dealer hat Blackjack! Du verlierst.',
            };
        }

        // Dealer busted
        if (dealerValue.isBusted) {
            return {
                outcome: 'win',
                payout: playerHand.bet * 2,
                message: 'Dealer Bust! Du gewinnst!',
            };
        }

        // Compare values
        const playerFinal = playerValue.soft;
        const dealerFinal = dealerValue.soft;

        if (playerFinal > dealerFinal) {
            return {
                outcome: 'win',
                payout: playerHand.bet * 2,
                message: `${playerFinal} schlägt ${dealerFinal}. Du gewinnst!`,
            };
        } else if (dealerFinal > playerFinal) {
            return {
                outcome: 'lose',
                payout: 0,
                message: `${dealerFinal} schlägt ${playerFinal}. Dealer gewinnt.`,
            };
        } else {
            return {
                outcome: 'push',
                payout: playerHand.bet,
                message: `Push bei ${playerFinal}. Einsatz zurück.`,
            };
        }
    }

    /**
     * Creates a specific card (useful for testing/training)
     */
    createCard(rank: Rank, suit: Suit, faceUp: boolean = true): Card {
        return { rank, suit, faceUp };
    }

    /**
     * Gets the strategy code for a card rank
     */
    getStrategyCode(rank: Rank): string {
        return RANK_TO_STRATEGY_CODE[rank];
    }
}
