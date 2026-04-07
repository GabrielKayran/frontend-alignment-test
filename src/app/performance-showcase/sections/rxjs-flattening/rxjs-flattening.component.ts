import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-rxjs-flattening',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './rxjs-flattening.component.html',
  styleUrl: './rxjs-flattening.component.scss',
})
export class RxjsFlatteningComponent {
  readonly codeAnti = `<span class="cm">// switchMap for a save — cancels in-flight requests!</span>
saveBtn$.pipe(
  <span class="fn">switchMap</span>(() => <span class="kw">this</span>.http.<span class="fn">post</span>(<span class="str">'/save'</span>, data)),
).<span class="fn">subscribe</span>();
<span class="cm">// If the user clicks twice, the first POST is cancelled</span>
<span class="cm">// → data may never be persisted</span>`;

  readonly codeMiddle = `<span class="cm">// mergeMap — concurrent, good for parallel reads</span>
ids$.pipe(
  <span class="fn">mergeMap</span>(id => <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">\`/item/\${id}\`</span>)),
).<span class="fn">subscribe</span>();
<span class="cm">// All requests run in parallel — order not guaranteed</span>
<span class="cm">// Ideal for independent, parallel fetches</span>`;

  readonly codeBest = `<span class="cm">// switchMap for search; concatMap for ordered writes</span>
search$.pipe(
  <span class="fn">switchMap</span>(q => <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">\`/search?q=\${q}\`</span>)),
).<span class="fn">subscribe</span>(); <span class="cm">// cancels stale searches ✓</span>

saveBtn$.pipe(
  <span class="fn">concatMap</span>(() => <span class="kw">this</span>.http.<span class="fn">post</span>(<span class="str">'/save'</span>, data)),
).<span class="fn">subscribe</span>(); <span class="cm">// queues saves, none are lost ✓</span>`;
}
