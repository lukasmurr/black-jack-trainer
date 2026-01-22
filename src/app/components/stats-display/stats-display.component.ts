/**
 * Stats Display Component - Shows training statistics
 */

import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { TrainingStats } from '../../models';

@Component({
    selector: 'app-stats-display',
    standalone: true,
    templateUrl: './stats-display.component.html',
    styleUrl: './stats-display.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsDisplayComponent {
    readonly stats = input.required<TrainingStats>();
    readonly resetClicked = output<void>();

    readonly successRate = computed(() => {
        const s = this.stats();
        if (s.totalAttempts === 0) return 0;
        return Math.round((s.correctAttempts / s.totalAttempts) * 100);
    });

    categoryRate(category: 'hard' | 'soft' | 'pair'): number {
        const cat = this.stats().byCategory[category];
        if (cat.total === 0) return 0;
        return Math.round((cat.correct / cat.total) * 100);
    }
}
