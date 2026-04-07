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
import { NgOptimizedImageComponent } from './sections/ng-optimized-image/ng-optimized-image.component';
import { VirtualScrollComponent } from './sections/virtual-scroll/virtual-scroll.component';
import { PurePipeComponent } from './sections/pure-pipe/pure-pipe.component';
import { ToSignalComponent } from './sections/to-signal/to-signal.component';
import { EffectVsComputedComponent } from './sections/effect-vs-computed/effect-vs-computed.component';
import { LinkedSignalComponent } from './sections/linked-signal/linked-signal.component';
import { SignalInputComponent } from './sections/signal-input/signal-input.component';
import { FacadePatternComponent } from './sections/facade-pattern/facade-pattern.component';
import { SmartDumbComponent } from './sections/smart-dumb/smart-dumb.component';
import { InjectionTokenComponent } from './sections/injection-token/injection-token.component';
import { FolderStructureComponent } from './sections/folder-structure/folder-structure.component';
import { BypassSecurityComponent } from './sections/bypass-security/bypass-security.component';
import { HttpOnlyCookieComponent } from './sections/http-only-cookie/http-only-cookie.component';
import { HttpClientGenericsComponent } from './sections/http-client-generics/http-client-generics.component';
import { OutputFnComponent } from './sections/output-fn/output-fn.component';
import { TypeGuardComponent } from './sections/type-guard/type-guard.component';
import { InjectFnComponent } from './sections/inject-fn/inject-fn.component';
import { RouteInputBindingComponent } from './sections/route-input-binding/route-input-binding.component';
import { BootstrapAppComponent } from './sections/bootstrap-app/bootstrap-app.component';
import { RxjsFlatteningComponent } from './sections/rxjs-flattening/rxjs-flattening.component';
import { CombineLatestComponent } from './sections/combine-latest/combine-latest.component';
import { HigherOrderRxjsComponent } from './sections/higher-order-rxjs/higher-order-rxjs.component';

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
    NgOptimizedImageComponent,
    VirtualScrollComponent,
    PurePipeComponent,
    ToSignalComponent,
    EffectVsComputedComponent,
    LinkedSignalComponent,
    SignalInputComponent,
    FacadePatternComponent,
    SmartDumbComponent,
    InjectionTokenComponent,
    FolderStructureComponent,
    BypassSecurityComponent,
    HttpOnlyCookieComponent,
    HttpClientGenericsComponent,
    OutputFnComponent,
    TypeGuardComponent,
    InjectFnComponent,
    RouteInputBindingComponent,
    BootstrapAppComponent,
    RxjsFlatteningComponent,
    CombineLatestComponent,
    HigherOrderRxjsComponent,
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
    {
      id: 'ng-optimized-image',
      index: 12,
      titleKey: 'sections.ngOptimizedImage.title',
      subtitleKey: 'sections.ngOptimizedImage.navSubtitle',
    },
    {
      id: 'virtual-scroll',
      index: 13,
      titleKey: 'sections.virtualScroll.title',
      subtitleKey: 'sections.virtualScroll.navSubtitle',
    },
    {
      id: 'pure-pipe',
      index: 14,
      titleKey: 'sections.purePipe.title',
      subtitleKey: 'sections.purePipe.navSubtitle',
    },
    {
      id: 'to-signal',
      index: 15,
      titleKey: 'sections.toSignal.title',
      subtitleKey: 'sections.toSignal.navSubtitle',
    },
    {
      id: 'effect-vs-computed',
      index: 16,
      titleKey: 'sections.effectVsComputed.title',
      subtitleKey: 'sections.effectVsComputed.navSubtitle',
    },
    {
      id: 'linked-signal',
      index: 17,
      titleKey: 'sections.linkedSignal.title',
      subtitleKey: 'sections.linkedSignal.navSubtitle',
    },
    {
      id: 'signal-input',
      index: 18,
      titleKey: 'sections.signalInput.title',
      subtitleKey: 'sections.signalInput.navSubtitle',
    },
    {
      id: 'facade-pattern',
      index: 19,
      titleKey: 'sections.facadePattern.title',
      subtitleKey: 'sections.facadePattern.navSubtitle',
    },
    {
      id: 'smart-dumb',
      index: 20,
      titleKey: 'sections.smartDumb.title',
      subtitleKey: 'sections.smartDumb.navSubtitle',
    },
    {
      id: 'injection-token',
      index: 21,
      titleKey: 'sections.injectionToken.title',
      subtitleKey: 'sections.injectionToken.navSubtitle',
    },
    {
      id: 'folder-structure',
      index: 22,
      titleKey: 'sections.folderStructure.title',
      subtitleKey: 'sections.folderStructure.navSubtitle',
    },
    {
      id: 'bypass-security',
      index: 23,
      titleKey: 'sections.bypassSecurity.title',
      subtitleKey: 'sections.bypassSecurity.navSubtitle',
    },
    {
      id: 'http-only-cookie',
      index: 24,
      titleKey: 'sections.httpOnlyCookie.title',
      subtitleKey: 'sections.httpOnlyCookie.navSubtitle',
    },
    {
      id: 'http-client-generics',
      index: 25,
      titleKey: 'sections.httpClientGenerics.title',
      subtitleKey: 'sections.httpClientGenerics.navSubtitle',
    },
    {
      id: 'output-fn',
      index: 26,
      titleKey: 'sections.outputFn.title',
      subtitleKey: 'sections.outputFn.navSubtitle',
    },
    {
      id: 'type-guard',
      index: 27,
      titleKey: 'sections.typeGuard.title',
      subtitleKey: 'sections.typeGuard.navSubtitle',
    },
    {
      id: 'inject-fn',
      index: 28,
      titleKey: 'sections.injectFn.title',
      subtitleKey: 'sections.injectFn.navSubtitle',
    },
    {
      id: 'route-input-binding',
      index: 29,
      titleKey: 'sections.routeInputBinding.title',
      subtitleKey: 'sections.routeInputBinding.navSubtitle',
    },
    {
      id: 'bootstrap-app',
      index: 30,
      titleKey: 'sections.bootstrapApp.title',
      subtitleKey: 'sections.bootstrapApp.navSubtitle',
    },
    {
      id: 'rxjs-flattening',
      index: 31,
      titleKey: 'sections.rxjsFlattening.title',
      subtitleKey: 'sections.rxjsFlattening.navSubtitle',
    },
    {
      id: 'combine-latest',
      index: 32,
      titleKey: 'sections.combineLatest.title',
      subtitleKey: 'sections.combineLatest.navSubtitle',
    },
    {
      id: 'higher-order-rxjs',
      index: 33,
      titleKey: 'sections.higherOrderRxjs.title',
      subtitleKey: 'sections.higherOrderRxjs.navSubtitle',
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
