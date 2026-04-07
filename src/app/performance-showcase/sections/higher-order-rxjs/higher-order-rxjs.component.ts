import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-higher-order-rxjs',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './higher-order-rxjs.component.html',
  styleUrl: './higher-order-rxjs.component.scss',
})
export class HigherOrderRxjsComponent {
  readonly codeAnti = `<span class="cm">// Nested subscribes — callback hell, impossible to cancel</span>
<span class="kw">this</span>.route.params.<span class="fn">subscribe</span>(params => {
  <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">\`/user/\${params['id']}\`</span>)
    .<span class="fn">subscribe</span>(user => {
      <span class="cm">// inner sub leaks; no way to cancel outer cleanly</span>
      <span class="kw">this</span>.user = user;
    });
});`;

  readonly codeBest = `<span class="cm">// Flat pipeline — single subscription, auto-cancels inner</span>
<span class="kw">this</span>.route.params.pipe(
  <span class="fn">switchMap</span>(params =>
    <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">\`/user/\${params['id']}\`</span>)
  ),
  <span class="fn">takeUntilDestroyed</span>(),
).<span class="fn">subscribe</span>(user => <span class="kw">this</span>.user = user);`;
}
