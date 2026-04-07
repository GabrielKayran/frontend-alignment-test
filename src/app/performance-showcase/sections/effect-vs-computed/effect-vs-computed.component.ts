import { Component, afterEveryRender, computed, effect, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface LogEntry {
  type: 'anti' | 'best';
  message: string;
}

const FIRST_NAMES = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
const LAST_NAMES  = ['Smith', 'Jones', 'Brown', 'Davis', 'Wilson'];

@Component({
  selector: 'app-section-effect-vs-computed',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './effect-vs-computed.component.html',
  styleUrl: './effect-vs-computed.component.scss',
})
export class EffectVsComputedComponent {
  protected readonly firstName = signal('Alice');
  protected readonly lastName  = signal('Smith');

  // ── Best: computed() ─────────────────────────────────────────────────────
  // Synchronous, memoized — re-evaluates only when firstName or lastName changes.
  protected readonly fullNameComputed = computed(
    () => `${this.firstName()} ${this.lastName()}`,
  );

  // ── Anti: effect() writing to a signal ──────────────────────────────────
  // Asynchronous — runs AFTER Angular finishes rendering.
  // Causes an extra render cycle every time firstName or lastName changes.
  protected readonly fullNameEffect = signal('Alice Smith');

  // ── Counters & log ───────────────────────────────────────────────────────
  protected readonly renderCount    = signal(0);
  protected readonly effectRunCount = signal(0);
  protected readonly computedEvalCount = signal(0);
  protected readonly logEntries     = signal<LogEntry[]>([]);

  // Non-reactive buffers — safe to write during rendering / effect execution
  private pendingLogs: LogEntry[] = [];
  private pendingComputedEvals = 0;
  private skipUpdate = false;

  private fnIdx = 0;
  private lnIdx = 0;

  constructor() {
    // Track computed() evaluations (non-reactively inside the computed fn)
    const originalComputed = this.fullNameComputed;
    effect(() => {
      // Reading fullNameComputed here re-evaluates it and lets us observe the value.
      // This effect is only for observation — it does NOT set any signal.
      const name = originalComputed();
      this.pendingLogs.push({
        type: 'best',
        message: `[COMPUTED] evaluated synchronously → "${name}"`,
      });
      this.pendingComputedEvals++;
    });

    // Anti-pattern: effect() writing to another signal to "derive" state.
    // Requires allowSignalWrites: true and causes an extra render per change.
    effect(
      () => {
        const name = `${this.firstName()} ${this.lastName()}`;
        this.fullNameEffect.set(name);   // ← signal write inside effect: anti-pattern
        this.effectRunCount.update(n => n + 1);
        this.pendingLogs.push({
          type: 'anti',
          message: `[EFFECT] ran after render → fullNameEffect set to "${name}"`,
        });
      },
      { allowSignalWrites: true },
    );

    // Flush buffers after each render — same skip-once pattern as getter-vs-signal
    afterEveryRender(() => {
      if (this.skipUpdate) { this.skipUpdate = false; return; }

      const logs    = this.pendingLogs.splice(0);
      const evals   = this.pendingComputedEvals;
      this.pendingComputedEvals = 0;

      this.skipUpdate = true;
      this.renderCount.update(n => n + 1);
      if (evals > 0) this.computedEvalCount.update(n => n + evals);
      if (logs.length > 0) {
        this.logEntries.update(entries => [...entries.slice(-19), ...logs]);
      }
    });
  }

  protected changeFirstName(): void {
    this.fnIdx = (this.fnIdx + 1) % FIRST_NAMES.length;
    this.firstName.set(FIRST_NAMES[this.fnIdx]);
  }

  protected changeLastName(): void {
    this.lnIdx = (this.lnIdx + 1) % LAST_NAMES.length;
    this.lastName.set(LAST_NAMES[this.lnIdx]);
  }

  protected clearLog(): void {
    this.logEntries.set([]);
    this.renderCount.set(0);
    this.effectRunCount.set(0);
    this.computedEvalCount.set(0);
  }

  readonly codeAnti = `<span class="cm">// Wrong: effect() to derive state — async, causes extra render</span>
<span class="kw">readonly</span> fullName = <span class="fn">signal</span>(<span class="str">''</span>);

<span class="fn">effect</span>(() => {
  <span class="kw">this</span>.fullName.<span class="fn">set</span>(
    <span class="kw">this</span>.<span class="fn">first</span>() + <span class="str">' '</span> + <span class="kw">this</span>.<span class="fn">last</span>()
  );
}, { allowSignalWrites: <span class="kw">true</span> }); <span class="cm">// ← flag required</span>`;

  readonly codeBest = `<span class="cm">// computed() — synchronous, memoized, no extra render</span>
<span class="kw">readonly</span> fullName = <span class="fn">computed</span>(() =>
  <span class="kw">this</span>.<span class="fn">first</span>() + <span class="str">' '</span> + <span class="kw">this</span>.<span class="fn">last</span>()
);

<span class="cm">// effect() only for side-effects (logging, DOM sync, analytics)</span>
<span class="fn">effect</span>(() => <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">'Name:'</span>, <span class="kw">this</span>.<span class="fn">fullName</span>()));`;
}
