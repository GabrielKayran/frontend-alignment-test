import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AppLanguage, LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);

  protected readonly currentLanguage = this.languageService.currentLanguage;
  protected readonly languages = this.languageService.languages;

  protected changeLanguage(language: AppLanguage): void {
    void this.languageService.changeLanguage(language);
  }
}
