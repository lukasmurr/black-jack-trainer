/**
 * Training Page Component - Strategy training mode
 */

import { Component, inject, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { GameStateService, StrategyService, SeoService } from '../../services';
import {
    HandComponent,
    ActionButtonsComponent,
    StatsDisplayComponent,
    TrainingFilterComponent,
} from '../../components';
import { TrainingFilter } from '../../models';

@Component({
    selector: 'app-training-page',
    standalone: true,
    imports: [
        HandComponent,
        ActionButtonsComponent,
        StatsDisplayComponent,
        TrainingFilterComponent,
    ],
    templateUrl: './training-page.component.html',
    styleUrl: './training-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TrainingPageComponent implements OnInit {
    protected readonly gameState = inject(GameStateService);
    private readonly strategyService = inject(StrategyService);
    private readonly seoService = inject(SeoService);

    // i18n labels
    protected readonly dealerShowsLabel = $localize`:@@training.dealerShows:Dealer zeigt`;
    protected readonly yourHandLabel = $localize`:@@training.yourHand:Deine Hand`;
    protected readonly hardHandLabel = $localize`:@@training.handType.hard:Hard Hand`;
    protected readonly softHandLabel = $localize`:@@training.handType.soft:Soft Hand`;
    protected readonly pairLabel = $localize`:@@training.handType.pair:Pair`;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        // Navigate with spacebar or enter when message is shown
        if (this.gameState.showMessage()) {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                this.onNextScenario();
            }
            return;
        }

        // Answer with keyboard shortcuts
        switch (event.key.toLowerCase()) {
            case 'h':
                this.onAnswer('hit');
                break;
            case 's':
                this.onAnswer('stand');
                break;
            case 'd':
                this.onAnswer('double');
                break;
            case 'p':
                if (this.isPairScenario()) {
                    this.onAnswer('split');
                }
                break;
        }
    }

    ngOnInit(): void {
        // SEO Meta-Tags aktualisieren
        this.seoService.updateSeo({
            title: $localize`:@@seo.training.title:Blackjack Strategie Training`,
            description: $localize`:@@seo.training.description:Lerne die optimale Blackjack Basic Strategy mit unserem interaktiven Training. Übe kostenlos und verbessere deine Gewinnchancen.`,
            keywords: $localize`:@@seo.training.keywords:Blackjack Training, Basic Strategy, Blackjack lernen, Kartenspiel üben, Casino Strategie`,
            canonicalUrl: 'https://blackjack-trainer.de/training',
            schema: this.seoService.getTrainingPageSchema(),
        });

        this.strategyService.loadStrategy().subscribe({
            next: () => this.gameState.startTraining(),
            error: (err) => console.error('Failed to load strategy:', err),
        });
    }

    startTraining(): void {
        this.gameState.startTraining();
    }

    onAnswer(action: 'hit' | 'stand' | 'double' | 'split'): void {
        this.gameState.submitTrainingAnswer(action);
    }

    onNextScenario(): void {
        this.gameState.nextTrainingScenario();
    }

    onFilterChanged(filter: Partial<TrainingFilter>): void {
        this.gameState.updateTrainingFilter(filter);
    }

    onResetStats(): void {
        this.gameState.resetTrainingStats();
    }

    getHandTypeLabel(): string {
        const scenario = this.gameState.trainingState().currentScenario;
        if (!scenario) return '';

        switch (scenario.handType) {
            case 'hard': return this.hardHandLabel;
            case 'soft': return this.softHandLabel;
            case 'pair': return this.pairLabel;
        }
    }

    isPairScenario(): boolean {
        return this.gameState.trainingState().currentScenario?.handType === 'pair';
    }
}
