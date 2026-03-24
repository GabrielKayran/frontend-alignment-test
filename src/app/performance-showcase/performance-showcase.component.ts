import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcherComponent } from '../shared/language-switcher/language-switcher.component';
import { GetterVsSignalComponent } from './sections/getter-vs-signal/getter-vs-signal.component';
import { InputDebounceComponent } from './sections/input-debounce/input-debounce.component';
import { LazyLoadingComponent } from './sections/lazy-loading/lazy-loading.component';
import { ObservableCleanupComponent } from './sections/observable-cleanup/observable-cleanup.component';
import { OnPushComponent } from './sections/on-push/on-push.component';
import { ServiceScopeComponent } from './sections/service-scope/service-scope.component';
import { SharedModulePatternComponent } from './sections/shared-module-pattern/shared-module-pattern.component';
import { SignalReadonlyComponent } from './sections/signal-readonly/signal-readonly.component';
import { TrackForComponent } from './sections/track-for/track-for.component';
import { DeferBlocksComponent } from './sections/defer-blocks/defer-blocks.component';
import { FormsStrategyComponent } from './sections/forms-strategy/forms-strategy.component';

interface Section {
  id: string;
  index: number;
  titleKey: string;
  subtitleKey: string;
}

@Component({
  selector: 'app-performance-showcase',
  standalone: true,
  // Each section component imports ONLY what it needs — exactly the pattern
  // demonstrated in Section 8 (SharedModule anti-pattern).
  imports: [
    DecimalPipe,
    TranslatePipe,
    LanguageSwitcherComponent,
    GetterVsSignalComponent,
    LazyLoadingComponent,
    SignalReadonlyComponent,
    ServiceScopeComponent,
    InputDebounceComponent,
    TrackForComponent,
    ObservableCleanupComponent,
    SharedModulePatternComponent,
    DeferBlocksComponent,
    OnPushComponent,
    FormsStrategyComponent,
  ],
  templateUrl: './performance-showcase.component.html',
  styleUrl: './performance-showcase.component.scss',
})
export class PerformanceShowcaseComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly sections: Section[] = [
    {
      id: 'getter-vs-signal',
      index: 1,
      titleKey: 'sections.getterVsSignal.title',
      subtitleKey: 'sections.getterVsSignal.navSubtitle',
    },
    {
      id: 'lazy-loading',
      index: 2,
      titleKey: 'sections.lazyLoading.title',
      subtitleKey: 'sections.lazyLoading.navSubtitle',
    },
    {
      id: 'signal-readonly',
      index: 3,
      titleKey: 'sections.signalReadonly.title',
      subtitleKey: 'sections.signalReadonly.navSubtitle',
    },
    {
      id: 'service-scope',
      index: 4,
      titleKey: 'sections.serviceScope.title',
      subtitleKey: 'sections.serviceScope.navSubtitle',
    },
    {
      id: 'debounce',
      index: 5,
      titleKey: 'sections.inputDebounce.title',
      subtitleKey: 'sections.inputDebounce.navSubtitle',
    },
    {
      id: 'track-for',
      index: 6,
      titleKey: 'sections.trackFor.title',
      subtitleKey: 'sections.trackFor.navSubtitle',
    },
    {
      id: 'unsubscribe',
      index: 7,
      titleKey: 'sections.observableCleanup.title',
      subtitleKey: 'sections.observableCleanup.navSubtitle',
    },
    {
      id: 'shared-module',
      index: 8,
      titleKey: 'sections.sharedModulePattern.title',
      subtitleKey: 'sections.sharedModulePattern.navSubtitle',
    },
    {
      id: 'defer-blocks',
      index: 9,
      titleKey: 'sections.deferBlocks.title',
      subtitleKey: 'sections.deferBlocks.navSubtitle',
    },
    {
      id: 'on-push',
      index: 10,
      titleKey: 'sections.onPush.title',
      subtitleKey: 'sections.onPush.navSubtitle',
    },
    {
      id: 'forms',
      index: 11,
      titleKey: 'sections.formsStrategy.title',
      subtitleKey: 'sections.formsStrategy.navSubtitle',
    },
  ];

  protected readonly activeSection = signal('getter-vs-signal');

  protected scrollToSection(id: string): void {
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private _scrollListener?: () => void;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Scroll-spy: walk sections top-to-bottom and pick the last one whose top
    // edge is above the detection line (30% from the top of the viewport).
    // This is more reliable than IntersectionObserver, which fires for multiple
    // sections simultaneously and has no guaranteed order among entries.
    const detect = (): void => {
      const detectionY = window.scrollY + window.innerHeight * 0.3;
      let active = this.sections[0].id;

      for (const section of this.sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= detectionY) {
          active = section.id;
        }
      }

      this.activeSection.set(active);
    };

    window.addEventListener('scroll', detect, { passive: true });
    this._scrollListener = detect;
    detect(); // set initial state
  }

  ngOnDestroy(): void {
    if (this._scrollListener) {
      window.removeEventListener('scroll', this._scrollListener);
    }
  }
}
