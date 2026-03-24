import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface SearchEntry {
  query: string;
  kind: 'immediate' | 'debounced';
}

@Component({
  selector: 'app-section-input-debounce',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './input-debounce.component.html',
  styleUrl: './input-debounce.component.scss',
})
export class InputDebounceComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchInput$ = new Subject<string>();

  protected readonly searchQuery = signal('');
  protected readonly immediateCallCount = signal(0);
  protected readonly debouncedCallCount = signal(0);
  protected readonly searchLog = signal<SearchEntry[]>([]);

  ngOnInit(): void {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (query) => {
          this.debouncedCallCount.update((count) => count + 1);
          this.searchLog.update((log) => [{ query, kind: 'debounced' }, ...log.slice(0, 11)]);
        },
      });
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.immediateCallCount.update((count) => count + 1);
    this.searchLog.update((log) => [{ query: value, kind: 'immediate' }, ...log.slice(0, 11)]);
    this.searchInput$.next(value);
  }

  protected resetDemo(): void {
    this.searchQuery.set('');
    this.immediateCallCount.set(0);
    this.debouncedCallCount.set(0);
    this.searchLog.set([]);
  }

  protected kindKey(kind: SearchEntry['kind']): string {
    return kind === 'immediate'
      ? 'sections.inputDebounce.demo.logKinds.immediate'
      : 'sections.inputDebounce.demo.logKinds.debounced';
  }

  readonly codeAnti = `<span class="cm">// Every keystroke fires an HTTP request â€” no throttle, no dedup</span>
<span class="fn">onSearchInput</span>(value: <span class="type">string</span>): <span class="type">void</span> {
  <span class="kw">this</span>.apiService.<span class="fn">search</span>(value).<span class="fn">subscribe</span>({
    next: results => <span class="kw">this</span>.results.<span class="fn">set</span>(results),
  });
}`;

  readonly codeBest = `<span class="kw">private readonly</span> searchInput$ = <span class="kw">new</span> <span class="type">Subject</span>&lt;<span class="type">string</span>&gt;();

<span class="kw">constructor</span>() {
  <span class="kw">this</span>.searchInput$.<span class="fn">pipe</span>(
    <span class="fn">debounceTime</span>(<span class="num">300</span>),           <span class="cm">// wait 300ms after last keystroke</span>
    <span class="fn">distinctUntilChanged</span>(),      <span class="cm">// skip if value didn't change</span>
    <span class="fn">switchMap</span>(q => <span class="kw">this</span>.api.<span class="fn">search</span>(q)),
    <span class="fn">takeUntilDestroyed</span>(),
  ).<span class="fn">subscribe</span>({
    next: results => <span class="kw">this</span>.results.<span class="fn">set</span>(results),
  });
}`;
}
