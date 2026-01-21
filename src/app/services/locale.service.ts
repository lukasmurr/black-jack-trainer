/**
 * Locale Service - Language detection and management for i18n
 */

import { Injectable, inject, LOCALE_ID } from '@angular/core';

export type SupportedLocale = 'de' | 'en';

@Injectable({
    providedIn: 'root',
})
export class LocaleService {
    private readonly localeId = inject(LOCALE_ID);

    readonly supportedLocales: SupportedLocale[] = ['de', 'en'];
    readonly defaultLocale: SupportedLocale = 'de';

    /**
     * Get the current locale from Angular's LOCALE_ID
     */
    get currentLocale(): SupportedLocale {
        const locale = this.localeId.split('-')[0];
        return this.supportedLocales.includes(locale as SupportedLocale)
            ? (locale as SupportedLocale)
            : this.defaultLocale;
    }

    /**
     * Check if current locale is German
     */
    get isGerman(): boolean {
        return this.currentLocale === 'de';
    }

    /**
     * Check if current locale is English
     */
    get isEnglish(): boolean {
        return this.currentLocale === 'en';
    }

    /**
     * Get the alternate locale (for language switcher)
     */
    get alternateLocale(): SupportedLocale {
        return this.currentLocale === 'de' ? 'en' : 'de';
    }

    /**
     * Get the display name for a locale
     */
    getLocaleDisplayName(locale: SupportedLocale): string {
        return locale === 'de' ? 'Deutsch' : 'English';
    }

    /**
     * Get the flag emoji for a locale
     */
    getLocaleFlag(locale: SupportedLocale): string {
        return locale === 'de' ? '🇩🇪' : '🇬🇧';
    }

    /**
     * Get the URL for switching to another locale
     * Replaces the current locale prefix with the target locale
     */
    getLocaleUrl(targetLocale: SupportedLocale, currentPath: string): string {
        // Remove current locale prefix if present
        const pathWithoutLocale = currentPath.replace(/^\/(de|en)/, '');
        return `/${targetLocale}${pathWithoutLocale || '/'}`;
    }

    /**
     * Get base URL for the current locale
     */
    getBaseUrl(): string {
        return this.currentLocale === 'de'
            ? 'https://blackjack-trainer.de'
            : 'https://blackjack-trainer.de/en';
    }
}
