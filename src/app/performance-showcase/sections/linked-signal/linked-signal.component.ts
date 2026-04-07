import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-linked-signal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './linked-signal.component.html',
  styleUrl: './linked-signal.component.scss',
})
export class LinkedSignalComponent {
  readonly codeAnti = `<span class="cm">// Two separate signals + effect to sync — verbose, race-prone</span>
<span class="kw">readonly</span> options = <span class="fn">signal</span>&lt;<span class="type">string</span>[]&gt;([]);
<span class="kw">readonly</span> selected = <span class="fn">signal</span>&lt;<span class="type">string</span> | <span class="kw">null</span>&gt;(<span class="kw">null</span>);

<span class="fn">effect</span>(() => {
  <span class="kw">this</span>.selected.<span class="fn">set</span>(<span class="kw">this</span>.<span class="fn">options</span>()[<span class="num">0</span>] ?? <span class="kw">null</span>);
});`;

  readonly codeBest = `<span class="cm">// linkedSignal — derived but writable; resets when source changes</span>
<span class="kw">readonly</span> options = <span class="fn">signal</span>&lt;<span class="type">string</span>[]&gt;([]);
<span class="kw">readonly</span> selected = <span class="fn">linkedSignal</span>(() => <span class="kw">this</span>.<span class="fn">options</span>()[<span class="num">0</span>]);

<span class="cm">// User can override: selected.set('other')</span>
<span class="cm">// When options changes, selected resets to options()[0]</span>`;
}
