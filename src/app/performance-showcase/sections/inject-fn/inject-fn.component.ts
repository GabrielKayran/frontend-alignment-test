import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-inject-fn',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './inject-fn.component.html',
  styleUrl: './inject-fn.component.scss',
})
export class InjectFnComponent {
  readonly codeAnti = `<span class="cm">// Constructor injection — all deps in one long signature</span>
<span class="kw">constructor</span>(
  <span class="kw">private</span> svc: <span class="type">MyService</span>,
  <span class="kw">private</span> router: <span class="type">Router</span>,
  <span class="kw">private</span> http: <span class="type">HttpClient</span>,
) {}`;

  readonly codeBest = `<span class="cm">// inject() — field-level, composable, works in functions</span>
<span class="kw">private readonly</span> svc    = <span class="fn">inject</span>(<span class="type">MyService</span>);
<span class="kw">private readonly</span> router = <span class="fn">inject</span>(<span class="type">Router</span>);
<span class="kw">private readonly</span> http   = <span class="fn">inject</span>(<span class="type">HttpClient</span>);

<span class="cm">// Also usable in standalone functions / composable helpers</span>`;
}
