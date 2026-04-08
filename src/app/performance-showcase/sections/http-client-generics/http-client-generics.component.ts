import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-http-client-generics',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './http-client-generics.component.html',
  styleUrl: './http-client-generics.component.scss',
})
export class HttpClientGenericsComponent {
  readonly codeAnti = `<span class="cm">// Returns Observable&lt;Object&gt; — no type safety</span>
<span class="fn">getUsers</span>() {
  <span class="kw">return</span> <span class="kw">this</span>.http.<span class="fn">get</span>(<span class="str">'/api/users'</span>);
  <span class="cm">// consumers must cast: (response as User[])</span>
  <span class="cm">// typos in property names compile with no error</span>
}`;

  readonly codeBest = `<span class="cm">// Returns Observable&lt;User[]&gt; — fully typed</span>
<span class="fn">getUsers</span>(): <span class="type">Observable</span>&lt;<span class="type">User</span>[]&gt; {
  <span class="kw">return</span> <span class="kw">this</span>.http.<span class="fn">get</span>&lt;<span class="type">User</span>[]&gt;(<span class="str">'/api/users'</span>);
  <span class="cm">// IntelliSense, refactoring, and compile-time checks work</span>
}`;
}
