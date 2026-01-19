/**
 * App Routes - Navigation configuration
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'training',
        pathMatch: 'full',
    },
    {
        path: 'training',
        loadComponent: () =>
            import('./pages/training/training-page.component').then(m => m.TrainingPageComponent),
        title: 'Blackjack Training',
    },
    {
        path: 'game',
        loadComponent: () =>
            import('./pages/game/game-page.component').then(m => m.GamePageComponent),
        title: 'Blackjack Spiel',
    },
    {
        path: '**',
        redirectTo: 'training',
    },
];
