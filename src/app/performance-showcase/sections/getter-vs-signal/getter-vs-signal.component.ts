import { Component, computed, signal, effect, afterEveryRender } from '@angular/core';

interface ConsoleEntry {
  type: 'anti' | 'best';
  message: string;
}

@Component({
  selector: 'app-section-getter-vs-signal',
  standalone: true,
  imports: [],
  templateUrl: './getter-vs-signal.component.html',
  styleUrl: './getter-vs-signal.component.scss',
})
export class GetterVsSignalComponent {
  protected readonly filterTags = signal<string[]>(['angular', 'performance']);
  protected readonly cdTriggerCount = signal(0);
  protected readonly consoleEntries = signal<ConsoleEntry[]>([]);
  protected readonly getterCallCount = signal(0);
  protected readonly computedRevalCount = signal(0);

  // Plain array — safe to write during rendering (no signals, no reactive side-effects)
  private readonly _pendingGetterLogs: ConsoleEntry[] = [];
  // Flag: true during the flush render so the getter doesn't re-log its own flush
  private _skipGetterLog = false;

  // Anti-pattern: re-evaluates on every change detection cycle
  get hasFilterTagGetter(): boolean {
    const result = this.filterTags().includes('filter');
    if (!this._skipGetterLog) {
      this._pendingGetterLogs.push({
        type: 'anti',
        message: `[GETTER] CD cycle → re-evaluated → ${result}`,
      });
    }
    return result;
  }

  // Best practice: memoized — only re-evaluates when filterTags changes
  protected readonly hasFilterTagComputed = computed(() => this.filterTags().includes('filter'));

  constructor() {
    // effect() runs outside the rendering phase — signal writes are safe here.
    // Re-runs whenever hasFilterTagComputed's dependency (filterTags) changes.
    effect(() => {
      const result = this.hasFilterTagComputed();
      this.computedRevalCount.update((n) => n + 1);
      this.consoleEntries.update((entries) => [
        ...entries.slice(-19),
        { type: 'best', message: `[COMPUTED] filterTags changed → re-evaluated → ${result}` },
      ]);
    });

    // afterRender fires after every render cycle.
    // If the getter logged real calls, flush them to signals here.
    // _skipGetterLog = true tells the getter to stay silent during the resulting flush render,
    // then resets on the next afterRender so the component is ready for the next interaction.
    afterEveryRender(() => {
      if (this._skipGetterLog) {
        this._skipGetterLog = false;
        return;
      }

      const pending = this._pendingGetterLogs.splice(0);
      if (pending.length === 0) return;

      this._skipGetterLog = true;
      this.getterCallCount.update((n) => n + pending.length);
      this.consoleEntries.update((entries) => [
        ...entries.slice(-(20 - pending.length)),
        ...pending,
      ]);
    });
  }

  protected triggerChangeDetection(): void {
    // Bumping cdTriggerCount is enough — it triggers a CD cycle, the getter runs,
    // and afterRender handles the rest honestly.
    this.cdTriggerCount.update((n) => n + 1);
  }

  protected toggleFilterTag(): void {
    this.filterTags.update((tags) =>
      tags.includes('filter') ? tags.filter((t) => t !== 'filter') : [...tags, 'filter'],
    );
  }

  protected clearConsole(): void {
    this._pendingGetterLogs.length = 0;
    this.consoleEntries.set([]);
    this.getterCallCount.set(0);
    this.computedRevalCount.set(0);
    this.cdTriggerCount.set(0);
  }

  readonly codeAnti = `<span class="cm">// Called on EVERY change detection cycle — even when tags never changed</span>
<span class="kw">get</span> <span class="fn">hasFilterTag</span>(): <span class="type">boolean</span> {
  <span class="kw">return</span> <span class="kw">this</span>.tags.<span class="fn">includes</span>(<span class="str">'filter'</span>); <span class="cm">// expensive if tags is large</span>
}`;

  readonly codeBest = `<span class="cm">// Recalculates ONLY when filterTags signal changes</span>
<span class="kw">protected readonly</span> hasFilterTag = <span class="fn">computed</span>(() =>
  <span class="kw">this</span>.filterTags().<span class="fn">includes</span>(<span class="str">'filter'</span>),
);`;
}
