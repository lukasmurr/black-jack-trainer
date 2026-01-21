/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Register locale data for both languages
registerLocaleData(localeDe, 'de');
registerLocaleData(localeEn, 'en');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
