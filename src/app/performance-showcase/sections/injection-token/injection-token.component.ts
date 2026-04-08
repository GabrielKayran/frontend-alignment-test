import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-injection-token',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './injection-token.component.html',
  styleUrl: './injection-token.component.scss',
})
export class InjectionTokenComponent {
  readonly codeAnti = `<span class="cm">// Hardcoded env reference — untestable, not swappable</span>
<span class="tag">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">ApiService</span> {
  <span class="kw">private</span> base = environment.apiUrl;

  <span class="fn">getUsers</span>() {
    <span class="kw">return</span> <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">\`\${this.base}/users\`</span>);
  }
}`;

  readonly codeBest = `<span class="cm">// InjectionToken — testable, overridable per environment</span>
<span class="kw">export const</span> <span class="type">API_URL</span> = <span class="kw">new</span> <span class="type">InjectionToken</span>&lt;<span class="type">string</span>&gt;(<span class="str">'API_URL'</span>, {
  factory: () => <span class="fn">inject</span>(<span class="type">ENVIRONMENT</span>).apiUrl,
});

<span class="kw">export class</span> <span class="type">ApiService</span> {
  <span class="kw">private</span> base = <span class="fn">inject</span>(<span class="type">API_URL</span>);
}`;
}
