/**
 * Message Display Component - Shows feedback messages
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-message-display',
    standalone: true,
    templateUrl: './message-display.component.html',
    styleUrl: './message-display.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageDisplayComponent {
    readonly message = input.required<string>();
    readonly show = input(false);
    readonly dismissed = output<void>();

    isSuccess(): boolean {
        return this.message().includes('✓') || this.message().includes('Richtig');
    }

    isError(): boolean {
        return this.message().includes('✗') || this.message().includes('Falsch');
    }
}
