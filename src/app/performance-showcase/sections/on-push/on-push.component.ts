import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-on-push',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './on-push.component.html',
  styleUrl: './on-push.component.scss',
})
export class OnPushComponent {
  protected defaultRenders = signal(0);
  protected onPushRenders = signal(0);
  protected signalVersion = signal(0);

  // Simulates an external CD trigger that Angular zones propagate upward:
  // setTimeout callbacks, HTTP responses, DOM events on parent components, etc.
  protected triggerCD(): void {
    // Default strategy: re-checks on every CD cycle regardless of changed inputs.
    this.defaultRenders.update((n) => n + 1);
    // OnPush: skips re-checking — no @Input reference changed, no signal emitted.
  }

  // Simulates mutating a Signal or changing an @Input reference.
  protected changeSignal(): void {
    this.signalVersion.update((n) => n + 1);
    // Both strategies re-render here: the signal change marks the view dirty.
    this.defaultRenders.update((n) => n + 1);
    this.onPushRenders.update((n) => n + 1);
  }

  protected resetDemo(): void {
    this.defaultRenders.set(0);
    this.onPushRenders.set(0);
    this.signalVersion.set(0);
  }

  readonly codeAnti = `<span class="cm">// ❌ Default — component re-checks on EVERY CD cycle</span>
<span class="tag">@Component</span>({
  <span class="attr">selector</span>: <span class="str">'app-dashboard'</span>,
  <span class="attr">standalone</span>: <span class="kw">true</span>,
  <span class="cm">// changeDetection not set → Default is implicit</span>
  <span class="attr">templateUrl</span>: <span class="str">'./dashboard.component.html'</span>,
})
<span class="kw">export class</span> <span class="type">DashboardComponent</span> {
  <span class="kw">@Input()</span> title = <span class="str">''</span>;
  <span class="cm">// Re-checks bindings even when title hasn't changed.</span>
  <span class="cm">// A setTimeout in a parent component already triggers this.</span>
}`;

  readonly codeBest = `<span class="cm">// ✅ OnPush — re-renders only when necessary</span>
<span class="tag">@Component</span>({
  <span class="attr">selector</span>: <span class="str">'app-dashboard'</span>,
  <span class="attr">standalone</span>: <span class="kw">true</span>,
  <span class="attr">changeDetection</span>: <span class="type">ChangeDetectionStrategy</span>.<span class="fn">OnPush</span>,
  <span class="attr">templateUrl</span>: <span class="str">'./dashboard.component.html'</span>,
})
<span class="kw">export class</span> <span class="type">DashboardComponent</span> {
  <span class="kw">@Input()</span> title = <span class="str">''</span>; <span class="cm">// ✓ re-renders if reference changes</span>
  count = <span class="fn">signal</span>(<span class="num">0</span>);    <span class="cm">// ✓ re-renders when signal changes</span>
  data$ = <span class="kw">this</span>.svc.data$; <span class="cm">// ✓ re-renders via async pipe</span>
  <span class="cm">// Anything else → component stays dormant.</span>
}`;
}
