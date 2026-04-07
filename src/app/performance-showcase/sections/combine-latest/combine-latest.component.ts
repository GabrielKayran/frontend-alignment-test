import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-combine-latest',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './combine-latest.component.html',
  styleUrl: './combine-latest.component.scss',
})
export class CombineLatestComponent {
  readonly codeAnti = `<span class="cm">// Nested subscribes — callback hell, hard to clean up</span>
this.user$.<span class="fn">subscribe</span>(user => {
  this.prefs$.<span class="fn">subscribe</span>(prefs => {
    <span class="cm">// inner subscription leaks if outer completes first</span>
    this.<span class="fn">render</span>(user, prefs);
  });
});`;

  readonly codeBest = `<span class="cm">// combineLatest — emits whenever either source emits</span>
<span class="fn">combineLatest</span>([<span class="kw">this</span>.user$, <span class="kw">this</span>.prefs$]).pipe(
  <span class="fn">takeUntilDestroyed</span>(),
).<span class="fn">subscribe</span>(([user, prefs]) => <span class="kw">this</span>.<span class="fn">render</span>(user, prefs));

<span class="cm">// withLatestFrom — only user$ drives; prefs sampled silently</span>
this.user$.pipe(<span class="fn">withLatestFrom</span>(<span class="kw">this</span>.prefs$));`;
}
