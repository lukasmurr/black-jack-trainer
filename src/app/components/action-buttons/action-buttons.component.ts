/**
 * Action Buttons Component - Hit, Stand, Double, Split buttons
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-action-buttons',
    standalone: true,
    templateUrl: './action-buttons.component.html',
    styleUrl: './action-buttons.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonsComponent {
    readonly canHit = input(false);
    readonly canStand = input(false);
    readonly canDouble = input(false);
    readonly canSplit = input(false);

    readonly hitClicked = output<void>();
    readonly standClicked = output<void>();
    readonly doubleClicked = output<void>();
    readonly splitClicked = output<void>();
}
