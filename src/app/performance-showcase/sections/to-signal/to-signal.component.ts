import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-to-signal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './to-signal.component.html',
  styleUrl: './to-signal.component.scss',
})
export class ToSignalComponent {
  readonly codeAnti = `<span class="cm">// Manual subscribe — boilerplate, easy to leak</span>
<span class="kw">export class</span> <span class="type">ItemsComponent</span> {
  items: <span class="type">Item</span>[] = [];
  <span class="kw">constructor</span>() {
    <span class="fn">inject</span>(<span class="type">HttpClient</span>).<span class="fn">get</span>&lt;<span class="type">Item</span>[]&gt;(<span class="str">'/api/items'</span>)
      .<span class="fn">pipe</span>(<span class="fn">takeUntilDestroyed</span>())
      .<span class="fn">subscribe</span>(data => <span class="kw">this</span>.items = data);
  }
}`;

  readonly codeBest = `<span class="cm">// toSignal — one line, auto-unsubscribes, signal-reactive</span>
<span class="kw">export class</span> <span class="type">ItemsComponent</span> {
  <span class="kw">readonly</span> items = <span class="fn">toSignal</span>(
    <span class="fn">inject</span>(<span class="type">HttpClient</span>).<span class="fn">get</span>&lt;<span class="type">Item</span>[]&gt;(<span class="str">'/api/items'</span>),
    { initialValue: [] },
  );
}`;
}
