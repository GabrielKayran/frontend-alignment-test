import { Component, afterEveryRender, computed, effect, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ConsoleEntry {
  type: 'anti' | 'best';
  result: boolean;
  translationKey: string;
}

@Component({
  selector: 'app-section-getter-vs-signal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './getter-vs-signal.component.html',
  styleUrl: './getter-vs-signal.component.scss',
})
export class GetterVsSignalComponent {
  protected readonly filterTags = signal<string[]>(['angular', 'performance']);
  protected readonly cdTriggerCount = signal(0);
  protected readonly consoleEntries = signal<ConsoleEntry[]>([]);
  protected readonly getterCallCount = signal(0);
  protected readonly computedRevalCount = signal(0);

  private readonly pendingGetterLogs: ConsoleEntry[] = [];
  private skipGetterLog = false;

  get hasFilterTagGetter(): boolean {
    const result = this.filterTags().includes('filter');

    if (!this.skipGetterLog) {
      this.pendingGetterLogs.push({
        type: 'anti',
        result,
        translationKey: 'sections.getterVsSignal.demo.logs.getterPrefix',
      });
    }

    return result;
  }

  protected readonly hasFilterTagComputed = computed(() => this.filterTags().includes('filter'));

  constructor() {
    effect(() => {
      const result = this.hasFilterTagComputed();

      this.computedRevalCount.update((count) => count + 1);
      this.consoleEntries.update((entries) => [
        ...entries.slice(-19),
        {
          type: 'best',
          result,
          translationKey: 'sections.getterVsSignal.demo.logs.computedPrefix',
        },
      ]);
    });

    afterEveryRender(() => {
      if (this.skipGetterLog) {
        this.skipGetterLog = false;
        return;
      }

      const pendingLogs = this.pendingGetterLogs.splice(0);
      if (pendingLogs.length === 0) {
        return;
      }

      this.skipGetterLog = true;
      this.getterCallCount.update((count) => count + pendingLogs.length);
      this.consoleEntries.update((entries) => [
        ...entries.slice(-(20 - pendingLogs.length)),
        ...pendingLogs,
      ]);
    });
  }

  protected triggerChangeDetection(): void {
    this.cdTriggerCount.update((count) => count + 1);
  }

  protected toggleFilterTag(): void {
    this.filterTags.update((tags) =>
      tags.includes('filter') ? tags.filter((tag) => tag !== 'filter') : [...tags, 'filter'],
    );
  }

  protected clearConsole(): void {
    this.pendingGetterLogs.length = 0;
    this.consoleEntries.set([]);
    this.getterCallCount.set(0);
    this.computedRevalCount.set(0);
    this.cdTriggerCount.set(0);
  }

  protected booleanKey(value: boolean): string {
    return value ? 'common.boolean.true' : 'common.boolean.false';
  }

  readonly codeAnti = `<span class="cm">// Called on EVERY change detection cycle â€” even when tags never changed</span>
<span class="kw">get</span> <span class="fn">hasFilterTag</span>(): <span class="type">boolean</span> {
  <span class="kw">return</span> <span class="kw">this</span>.tags.<span class="fn">includes</span>(<span class="str">'filter'</span>); <span class="cm">// expensive if tags is large</span>
}`;

  readonly codeBest = `<span class="cm">// Recalculates ONLY when filterTags signal changes</span>
<span class="kw">protected readonly</span> hasFilterTag = <span class="fn">computed</span>(() =>
  <span class="kw">this</span>.filterTags().<span class="fn">includes</span>(<span class="str">'filter'</span>),
);`;
}
