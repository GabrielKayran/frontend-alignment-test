import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-signal-input',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './signal-input.component.html',
  styleUrl: './signal-input.component.scss',
})
export class SignalInputComponent {
  readonly codeAnti = `<span class="cm">// @Input decorator — not reactive, needs ngOnChanges</span>
<span class="tag">@Input</span>() title: <span class="type">string</span> = <span class="str">''</span>;
<span class="tag">@Input</span>() userId: <span class="type">number</span> = <span class="num">0</span>;

<span class="fn">ngOnChanges</span>(): <span class="type">void</span> {
  <span class="cm">// re-derive state on every input change manually</span>
  <span class="kw">this</span>.label = <span class="kw">this</span>.title.<span class="fn">toUpperCase</span>();
}`;

  readonly codeBest = `<span class="cm">// Signal input — reactive, composable with computed()</span>
<span class="kw">readonly</span> title = <span class="fn">input</span>&lt;<span class="type">string</span>&gt;(<span class="str">''</span>);
<span class="kw">readonly</span> userId = <span class="fn">input</span>&lt;<span class="type">number</span>&gt;(<span class="num">0</span>);

<span class="cm">// Derived state updates automatically — no lifecycle hook</span>
<span class="kw">readonly</span> label = <span class="fn">computed</span>(() => <span class="kw">this</span>.<span class="fn">title</span>().<span class="fn">toUpperCase</span>());`;
}
