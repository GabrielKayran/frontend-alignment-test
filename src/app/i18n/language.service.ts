import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

const LANGUAGE_STORAGE_KEY = 'app.language';

export type AppLanguage = 'en.US' | 'pt-BR';

export interface LanguageOption {
  code: AppLanguage;
  htmlLang: string;
  labelKey: string;
}

export const DEFAULT_LANGUAGE = 'en.US' as const;

const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  {
    code: 'en.US',
    htmlLang: 'en-US',
    labelKey: 'layout.language.english',
  },
  {
    code: 'pt-BR',
    htmlLang: 'pt-BR',
    labelKey: 'layout.language.portuguese',
  },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);

  readonly languages = SUPPORTED_LANGUAGES;
  readonly currentLanguage = signal<AppLanguage>(DEFAULT_LANGUAGE);

  constructor() {
    this.translate.addLangs(this.languages.map(({ code }) => code));
  }

  async initialize(): Promise<void> {
    if (this.translate.getFallbackLang() !== DEFAULT_LANGUAGE) {
      await firstValueFrom(this.translate.setFallbackLang(DEFAULT_LANGUAGE));
    }

    await this.applyLanguage(this.getStoredLanguage() ?? DEFAULT_LANGUAGE, false);
  }

  async changeLanguage(language: AppLanguage): Promise<void> {
    await this.applyLanguage(language, true);
  }

  private async applyLanguage(language: AppLanguage, persist: boolean): Promise<void> {
    const nextLanguage = this.isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    if (this.translate.getCurrentLang() !== nextLanguage) {
      await firstValueFrom(this.translate.use(nextLanguage));
    }

    this.currentLanguage.set(nextLanguage);
    this.document.documentElement.lang = this.getHtmlLang(nextLanguage);

    if (persist && isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  }

  private getStoredLanguage(): AppLanguage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return this.isSupportedLanguage(storedLanguage) ? storedLanguage : null;
  }

  private getHtmlLang(language: AppLanguage): string {
    return (
      this.languages.find((supportedLanguage) => supportedLanguage.code === language)?.htmlLang ??
      'en-US'
    );
  }

  private isSupportedLanguage(language: string | null): language is AppLanguage {
    return this.languages.some((supportedLanguage) => supportedLanguage.code === language);
  }
}
