import {
  Component,
  computed,
  signal,
  effect,
  inject,
  DestroyRef,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// ---------------------------------------------------------------------------
// Section 1 — Getter vs Signal: simulated console output
// ---------------------------------------------------------------------------
interface ConsoleEntry {
  type: 'anti' | 'best';
  message: string;
}

// ---------------------------------------------------------------------------
// Section 5 — Debounce: search call tracking
// ---------------------------------------------------------------------------
interface SearchEntry {
  query: string;
  kind: 'immediate' | 'debounced';
}

// ---------------------------------------------------------------------------
// Navigation sections definition
// ---------------------------------------------------------------------------
interface Section {
  id: string;
  index: number;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-performance-showcase',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './performance-showcase.component.html',
  styleUrl: './performance-showcase.component.scss',
})
export class PerformanceShowcaseComponent implements OnInit, OnDestroy {

  // -------------------------------------------------------------------------
  // Dependencies
  // -------------------------------------------------------------------------
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  readonly sections: Section[] = [
    { id: 'getter-vs-signal',  index: 1, title: 'Getter vs Signal',         subtitle: 'Change detection cost' },
    { id: 'lazy-loading',      index: 2, title: 'Lazy Loading',             subtitle: 'Bundle strategy' },
    { id: 'signal-readonly',   index: 3, title: 'Signal Encapsulation',     subtitle: 'Writable vs Readonly' },
    { id: 'service-scope',     index: 4, title: 'Service Scope',            subtitle: 'Root vs component-level' },
    { id: 'debounce',          index: 5, title: 'Input Debounce',           subtitle: 'RxJS operators' },
    { id: 'forms',             index: 6, title: 'Forms Strategy',           subtitle: 'Reactive vs Template' },
    { id: 'unsubscribe',       index: 7, title: 'Observable Cleanup',       subtitle: 'Subscription management' },
    { id: 'shared-module',     index: 8, title: 'SharedModule Pattern',     subtitle: 'Modern standalone approach' },
  ];

  protected readonly activeSection = signal('getter-vs-signal');

  protected scrollToSection(id: string): void {
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // -------------------------------------------------------------------------
  // Section 1 — Getter vs Signal (Computed)
  // -------------------------------------------------------------------------
  protected readonly filterTags = signal<string[]>(['angular', 'performance']);
  protected readonly cdTriggerCount = signal(0);
  protected readonly consoleEntries = signal<ConsoleEntry[]>([]);

  // Anti-pattern: getter re-evaluates on every change detection cycle.
  // It reads filterTags() which makes it look reactive, but it is ALSO called
  // whenever any other unrelated binding in the template triggers a CD cycle.
  get hasFilterTagGetter(): boolean {
    return this.filterTags().includes('filter');
  }

  // Best practice: computed() is memoized — re-evaluates ONLY when filterTags changes.
  protected readonly hasFilterTagComputed = computed(() =>
    this.filterTags().includes('filter'),
  );

  // Each CD cycle calls the getter exactly once per template occurrence.
  // We count cycles via the button handler — no signal writes during rendering.
  protected readonly getterCallCount = signal(0);
  protected readonly computedRevalCount = signal(0);

  constructor() {
    // effect() runs OUTSIDE the rendering phase, so signal writes are safe here.
    // It re-runs whenever hasFilterTagComputed's dependency (filterTags) changes.
    effect(() => {
      const result = this.hasFilterTagComputed();
      this.computedRevalCount.update(n => n + 1);
      this.consoleEntries.update(entries => [
        ...entries.slice(-19),
        {
          type: 'best',
          message: `[COMPUTED] filterTags changed → re-evaluated → ${result}`,
        },
      ]);
    });
  }

  protected triggerChangeDetection(): void {
    // Each button click = one CD cycle = one getter call in the template.
    // We increment both here so the counter is accurate without signal writes in the template.
    const next = this.cdTriggerCount() + 1;
    this.cdTriggerCount.set(next);
    this.getterCallCount.update(n => n + 1);
    this.consoleEntries.update(entries => [
      ...entries.slice(-19),
      {
        type: 'anti',
        message: `[GETTER] CD cycle #${next} → getter called again`,
      },
    ]);
  }

  protected toggleFilterTag(): void {
    this.filterTags.update(tags =>
      tags.includes('filter')
        ? tags.filter(t => t !== 'filter')
        : [...tags, 'filter'],
    );
  }

  protected clearConsole(): void {
    this.consoleEntries.set([]);
    this.getterCallCount.set(0);
    this.computedRevalCount.set(0);
  }

  // -------------------------------------------------------------------------
  // Section 5 — debounceTime + distinctUntilChanged
  // -------------------------------------------------------------------------
  private readonly searchInput$ = new Subject<string>();
  protected readonly searchQuery = signal('');
  protected readonly immediateCallCount = signal(0);
  protected readonly debouncedCallCount = signal(0);
  protected readonly searchLog = signal<SearchEntry[]>([]);

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    // Simulates an API call fired immediately on every keystroke (anti-pattern)
    this.immediateCallCount.update(n => n + 1);
    this.searchLog.update(log => [
      { query: value, kind: 'immediate' },
      ...log.slice(0, 11),
    ]);
    this.searchInput$.next(value);
  }

  protected resetDebounceDemo(): void {
    this.searchQuery.set('');
    this.immediateCallCount.set(0);
    this.debouncedCallCount.set(0);
    this.searchLog.set([]);
  }

  // -------------------------------------------------------------------------
  // Section 6 — Reactive Forms
  // -------------------------------------------------------------------------
  protected readonly reactiveForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected readonly reactiveFormSubmitted = signal(false);

  protected submitReactiveForm(): void {
    if (this.reactiveForm.valid) {
      this.reactiveFormSubmitted.set(true);
    } else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  // Template-driven form model (Section 6)
  protected readonly templateEmail = signal('');

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    // Subscribe with takeUntilDestroyed (best practice — Section 7)
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: query => {
          this.debouncedCallCount.update(n => n + 1);
          this.searchLog.update(log => [
            { query, kind: 'debounced' },
            ...log.slice(0, 11),
          ]);
        },
      });

    // IntersectionObserver is only available in the browser (not in SSR/Node)
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.activeSection.set(entry.target.id);
            }
          }
        },
        { threshold: 0.3 },
      );

      // Observe all sections after the view is ready
      setTimeout(() => {
        for (const section of this.sections) {
          const el = document.getElementById(section.id);
          if (el) observer.observe(el);
        }
      }, 0);

      this._sectionObserver = observer;
    }
  }

  private _sectionObserver?: IntersectionObserver;

  ngOnDestroy(): void {
    this._sectionObserver?.disconnect();
  }

  // -------------------------------------------------------------------------
  // Code snippet helpers — pre-rendered HTML strings for each panel
  // -------------------------------------------------------------------------

  readonly code = {

    // Section 1
    getterAnti: `<span class="cm">// Called on EVERY change detection cycle — even when tags never changed</span>
<span class="kw">get</span> <span class="fn">hasFilterTag</span>(): <span class="type">boolean</span> {
  <span class="kw">return</span> <span class="kw">this</span>.tags.<span class="fn">includes</span>(<span class="str">'filter'</span>); <span class="cm">// expensive if tags is large</span>
}`,

    getterBest: `<span class="cm">// Recalculates ONLY when filterTags signal changes</span>
<span class="kw">protected readonly</span> hasFilterTag = <span class="fn">computed</span>(() =>
  <span class="kw">this</span>.filterTags().<span class="fn">includes</span>(<span class="str">'filter'</span>),
);`,

    // Section 2
    lazyAnti: `<span class="cm">// Old approach — requires a full NgModule wrapper</span>
<span class="kw">const</span> routes: <span class="type">Routes</span> = [{
  path: <span class="str">'dashboard'</span>,
  loadChildren: () =>
    <span class="fn">import</span>(<span class="str">'./dashboard/dashboard.module'</span>)
      .<span class="fn">then</span>(m => m.<span class="type">DashboardModule</span>),
}];

<span class="cm">// DashboardModule must declare and export DashboardComponent,</span>
<span class="cm">// pulling in the entire module graph even for a single page.</span>`,

    lazyBest: `<span class="cm">// Modern approach — load the standalone component directly</span>
<span class="kw">const</span> routes: <span class="type">Routes</span> = [{
  path: <span class="str">'dashboard'</span>,
  loadComponent: () =>
    <span class="fn">import</span>(<span class="str">'./dashboard/dashboard.component'</span>)
      .<span class="fn">then</span>(m => m.<span class="type">DashboardComponent</span>),
}];

<span class="cm">// No NgModule overhead. Angular splits exactly this component</span>
<span class="cm">// into its own chunk — smaller, faster initial load.</span>`,

    // Section 3
    signalAnti: `<span class="cm">// Anti-pattern: exposing WritableSignal lets ANY consumer mutate state</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">UserService</span> {
  <span class="kw">readonly</span> user: <span class="type">WritableSignal</span>&lt;<span class="type">User</span>&gt; = <span class="fn">signal</span>(<span class="kw">null</span>);
}

<span class="cm">// Any component can now do:</span>
<span class="kw">this</span>.userService.user.<span class="fn">set</span>({ name: <span class="str">'Hacker'</span> }); <span class="cm">// uncontrolled mutation</span>`,

    signalBest: `<span class="cm">// Service owns mutations internally; exposes only a readonly view</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">UserService</span> {
  <span class="kw">private readonly</span> _user = <span class="fn">signal</span>&lt;<span class="type">User | null</span>&gt;(<span class="kw">null</span>);
  <span class="kw">readonly</span> user = <span class="kw">this</span>._user.<span class="fn">asReadonly</span>();

  <span class="fn">loadUser</span>(id: <span class="type">string</span>): <span class="type">void</span> {
    <span class="cm">// Only this service can set _user</span>
    <span class="kw">this</span>._user.<span class="fn">set</span>(<span class="cm">/* fetched data */</span>);
  }
}`,

    // Section 4
    scopeAnti: `<span class="cm">// providedIn: 'root' creates a singleton that lives for the entire app.</span>
<span class="cm">// Fine for global services, but wrong for wizard/form state.</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">WizardStateService</span> {
  currentStep = <span class="fn">signal</span>(<span class="num">0</span>);
  formData = <span class="fn">signal</span>({});
  <span class="cm">// Lives forever — state leaks between wizard sessions!</span>
}`,

    scopeBest: `<span class="cm">// Component-level provider: created when component mounts,</span>
<span class="cm">// destroyed when it unmounts. State resets automatically.</span>
<span class="kw">@Component</span>({
  selector: <span class="str">'app-wizard'</span>,
  providers: [<span class="type">WizardStateService</span>], <span class="cm">// scoped to this component subtree</span>
  templateUrl: <span class="str">'./wizard.component.html'</span>,
  styleUrl: <span class="str">'./wizard.component.scss'</span>,
})
<span class="kw">export class</span> <span class="type">WizardComponent</span> {
  <span class="cm">// WizardStateService is injected as a fresh instance here</span>
  <span class="kw">private readonly</span> state = <span class="fn">inject</span>(<span class="type">WizardStateService</span>);
}`,

    // Section 5
    debounceAnti: `<span class="cm">// Every keystroke fires an HTTP request — no throttle, no dedup</span>
<span class="fn">onSearchInput</span>(value: <span class="type">string</span>): <span class="type">void</span> {
  <span class="kw">this</span>.apiService.<span class="fn">search</span>(value).<span class="fn">subscribe</span>({
    next: results => <span class="kw">this</span>.results.<span class="fn">set</span>(results),
  });
}`,

    debounceBest: `<span class="kw">private readonly</span> searchInput$ = <span class="kw">new</span> <span class="type">Subject</span>&lt;<span class="type">string</span>&gt;();

<span class="kw">constructor</span>() {
  <span class="kw">this</span>.searchInput$.<span class="fn">pipe</span>(
    <span class="fn">debounceTime</span>(<span class="num">300</span>),           <span class="cm">// wait 300ms after last keystroke</span>
    <span class="fn">distinctUntilChanged</span>(),      <span class="cm">// skip if value didn't change</span>
    <span class="fn">switchMap</span>(q => <span class="kw">this</span>.api.<span class="fn">search</span>(q)),
    <span class="fn">takeUntilDestroyed</span>(),
  ).<span class="fn">subscribe</span>({
    next: results => <span class="kw">this</span>.results.<span class="fn">set</span>(results),
  });
}`,

    // Section 6
    formsAnti: `<span class="cm">// Template-driven for complex validation — hard to test, hard to compose</span>
<span class="tag">&lt;form</span> <span class="attr">#f</span>=<span class="str">"ngForm"</span> <span class="attr">(ngSubmit)</span>=<span class="str">"submit(f)"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;input</span> <span class="attr">name</span>=<span class="str">"email"</span> <span class="attr">[(ngModel)]</span>=<span class="str">"email"</span>
         <span class="attr">required</span> <span class="attr">email</span> <span class="attr">#emailCtrl</span>=<span class="str">"ngModel"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;span</span> <span class="attr">*ngIf</span>=<span class="str">"emailCtrl.invalid &amp;&amp; emailCtrl.touched"</span><span class="tag">&gt;</span>
    Invalid email <span class="cm">&lt;!-- validation logic hidden in template --&gt;</span>
  <span class="tag">&lt;/span&gt;</span>
<span class="tag">&lt;/form&gt;</span>`,

    formsBest: `<span class="cm">// Reactive form: validation in TypeScript, easy to test and compose</span>
<span class="kw">protected readonly</span> form = <span class="kw">this</span>.fb.<span class="fn">group</span>({
  email: [<span class="str">''</span>, [<span class="type">Validators</span>.required, <span class="type">Validators</span>.email]],
  username: [<span class="str">''</span>, [<span class="type">Validators</span>.required, <span class="type">Validators</span>.minLength(<span class="num">3</span>)]],
});

<span class="cm">// Validation is explicit, type-safe, and trivially unit-testable.</span>
<span class="cm">// Use ngModel only for simple, standalone inputs.</span>`,

    // Section 7
    unsubAnti: `<span class="cm">// Manual unsubscribe — easy to forget, verbose</span>
<span class="kw">private</span> sub!: <span class="type">Subscription</span>;

<span class="fn">ngOnInit</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.sub = <span class="kw">this</span>.stream$.<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
}

<span class="fn">ngOnDestroy</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.sub.<span class="fn">unsubscribe</span>(); <span class="cm">// easy to forget one</span>
}`,

    unsubMiddle: `<span class="cm">// takeUntil pattern — better, but requires boilerplate Subject</span>
<span class="kw">private readonly</span> destroy$ = <span class="kw">new</span> <span class="type">Subject</span>&lt;<span class="type">void</span>&gt;();

<span class="fn">ngOnInit</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.stream$
    .<span class="fn">pipe</span>(<span class="fn">takeUntil</span>(<span class="kw">this</span>.destroy$))
    .<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
}

<span class="fn">ngOnDestroy</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.destroy$.<span class="fn">next</span>();
  <span class="kw">this</span>.destroy$.<span class="fn">complete</span>();
}`,

    unsubBest: `<span class="cm">// takeUntilDestroyed (Angular 16+) — no Subject, no ngOnDestroy</span>
<span class="kw">export class</span> <span class="type">MyComponent</span> {
  <span class="kw">private readonly</span> destroyRef = <span class="fn">inject</span>(<span class="type">DestroyRef</span>);

  <span class="kw">constructor</span>() {
    <span class="cm">// Works in inject() context — even outside ngOnInit</span>
    <span class="kw">this</span>.stream$
      .<span class="fn">pipe</span>(<span class="fn">takeUntilDestroyed</span>(<span class="kw">this</span>.destroyRef))
      .<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
  }
}`,

    // Section 8
    sharedAnti: `<span class="cm">// SharedModule bundles everything together — a common anti-pattern</span>
<span class="kw">@NgModule</span>({
  declarations: [
    <span class="type">ButtonComponent</span>, <span class="type">CardComponent</span>, <span class="type">TableComponent</span>,
    <span class="type">SpinnerComponent</span>, <span class="type">TooltipComponent</span>, <span class="cm">// ... 30 more</span>
  ],
  exports: [
    <span class="type">ButtonComponent</span>, <span class="type">CardComponent</span>, <span class="type">TableComponent</span>,
    <span class="type">CommonModule</span>, <span class="type">FormsModule</span>, <span class="cm">// ← forces every consumer</span>
  ],                            <span class="cm">// to load ALL of these</span>
})
<span class="kw">export class</span> <span class="type">SharedModule</span> {}`,

    sharedBest: `<span class="cm">// Standalone components: each imports ONLY what it needs</span>
<span class="kw">@Component</span>({
  selector: <span class="str">'app-dashboard'</span>,
  standalone: <span class="kw">true</span>,
  imports: [
    <span class="type">ButtonComponent</span>,   <span class="cm">// only these two are bundled</span>
    <span class="type">CardComponent</span>,
  ],
  templateUrl: <span class="str">'./dashboard.component.html'</span>,
  styleUrl: <span class="str">'./dashboard.component.scss'</span>,
})
<span class="kw">export class</span> <span class="type">DashboardComponent</span> {}

<span class="cm">// SpinnerComponent, TableComponent etc. are NOT included —</span>
<span class="cm">// they won't bloat this chunk at all.</span>`,

  };
}
