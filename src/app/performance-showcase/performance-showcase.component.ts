import {
  Component,
  signal,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';

import { GetterVsSignalComponent }    from './sections/getter-vs-signal/getter-vs-signal.component';
import { LazyLoadingComponent }       from './sections/lazy-loading/lazy-loading.component';
import { SignalReadonlyComponent }    from './sections/signal-readonly/signal-readonly.component';
import { ServiceScopeComponent }      from './sections/service-scope/service-scope.component';
import { InputDebounceComponent }     from './sections/input-debounce/input-debounce.component';
import { FormsStrategyComponent }     from './sections/forms-strategy/forms-strategy.component';
import { ObservableCleanupComponent } from './sections/observable-cleanup/observable-cleanup.component';
import { SharedModulePatternComponent } from './sections/shared-module-pattern/shared-module-pattern.component';

interface Section {
  id: string;
  index: number;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-performance-showcase',
  standalone: true,
  // Each section component imports ONLY what it needs — exactly the pattern
  // demonstrated in Section 8 (SharedModule anti-pattern).
  imports: [
    DecimalPipe,
    GetterVsSignalComponent,
    LazyLoadingComponent,
    SignalReadonlyComponent,
    ServiceScopeComponent,
    InputDebounceComponent,
    FormsStrategyComponent,
    ObservableCleanupComponent,
    SharedModulePatternComponent,
  ],
  templateUrl: './performance-showcase.component.html',
  styleUrl: './performance-showcase.component.scss',
})
export class PerformanceShowcaseComponent implements OnInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);

  readonly sections: Section[] = [
    { id: 'getter-vs-signal', index: 1, title: 'Getter vs Signal',      subtitle: 'Change detection cost' },
    { id: 'lazy-loading',     index: 2, title: 'Lazy Loading',          subtitle: 'Bundle strategy' },
    { id: 'signal-readonly',  index: 3, title: 'Signal Encapsulation',  subtitle: 'Writable vs Readonly' },
    { id: 'service-scope',    index: 4, title: 'Service Scope',         subtitle: 'Root vs component-level' },
    { id: 'debounce',         index: 5, title: 'Input Debounce',        subtitle: 'RxJS operators' },
    { id: 'forms',            index: 6, title: 'Forms Strategy',        subtitle: 'Reactive vs Template' },
    { id: 'unsubscribe',      index: 7, title: 'Observable Cleanup',    subtitle: 'Subscription management' },
    { id: 'shared-module',    index: 8, title: 'SharedModule Pattern',  subtitle: 'Modern standalone approach' },
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
