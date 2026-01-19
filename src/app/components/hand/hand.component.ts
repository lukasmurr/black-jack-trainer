/**
 * Hand Component - Displays a player or dealer hand
 */

import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Hand } from '../../models/hand.model';
import { BlackjackService } from '../../services';

@Component({
    selector: 'app-hand',
    standalone: true,
    imports: [CardComponent],
    templateUrl: './hand.component.html',
    styleUrl: './hand.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandComponent {
    readonly hand = input.required<Hand>();
    readonly label = input('Spieler');
    readonly isDealer = input(false);
    readonly isActive = input(false);
    readonly animate = input(false);
    readonly showValue = input(true);

    readonly cardOverlap = input(-40);

    constructor(private blackjackService: BlackjackService) { }

    readonly handValue = computed(() => {
        return this.blackjackService.calculateHandValue(this.hand().cards);
    });
}
