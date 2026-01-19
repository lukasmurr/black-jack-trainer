/**
 * Training Filter Component - Filter training scenarios by hand type
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainingFilter } from '../../models';

@Component({
    selector: 'app-training-filter',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './training-filter.component.html',
    styleUrl: './training-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingFilterComponent {
    readonly filter = input.required<TrainingFilter>();
    readonly filterChanged = output<Partial<TrainingFilter>>();

    toggleFilter(key: keyof TrainingFilter): void {
        const currentValue = this.filter()[key];
        this.filterChanged.emit({ [key]: !currentValue });
    }

    hasActiveFilter(): boolean {
        const f = this.filter();
        return f.hardHands || f.softHands || f.pairs;
    }
}
