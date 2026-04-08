import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-smart-dumb',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './smart-dumb.component.html',
  styleUrl: './smart-dumb.component.scss',
})
export class SmartDumbComponent {
  readonly codeAnti = `<span class="cm">// "Dumb" component that fetches its own data — hard to test</span>
<span class="kw">export class</span> <span class="type">UserCardComponent</span> {
  user = <span class="fn">toSignal</span>(<span class="fn">inject</span>(<span class="type">HttpClient</span>)
    .<span class="fn">get</span>&lt;<span class="type">User</span>&gt;(<span class="str">'/api/me'</span>));
  <span class="cm">// fetches on every instantiation, untestable in isolation</span>
}`;

  readonly codeBest = `<span class="cm">// Smart parent fetches; dumb child only renders</span>
<span class="cm">// Smart (container):</span>
<span class="kw">readonly</span> user = <span class="fn">toSignal</span>(<span class="kw">this</span>.http.<span class="fn">get</span>&lt;<span class="type">User</span>&gt;(<span class="str">'/api/me'</span>));
<span class="cm">// template: &lt;app-user-card [user]="user()" /&gt;</span>

<span class="cm">// Dumb (presentational):</span>
<span class="kw">readonly</span> user = <span class="fn">input</span>&lt;<span class="type">User</span> | <span class="kw">undefined</span>&gt;();
<span class="cm">// pure display — no HTTP, easily unit-tested</span>`;
}
