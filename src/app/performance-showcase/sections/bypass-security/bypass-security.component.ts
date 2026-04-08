import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-bypass-security',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './bypass-security.component.html',
  styleUrl: './bypass-security.component.scss',
})
export class BypassSecurityComponent {
  readonly codeAnti = `<span class="cm">// XSS risk — bypasses Angular's sanitizer entirely</span>
<span class="kw">export class</span> <span class="type">CommentComponent</span> {
  <span class="kw">private</span> sanitizer = <span class="fn">inject</span>(<span class="type">DomSanitizer</span>);

  safeHtml = <span class="kw">this</span>.sanitizer
    .<span class="fn">bypassSecurityTrustHtml</span>(userInput);
  <span class="cm">// if userInput contains &lt;script&gt;, it will execute</span>
}`;

  readonly codeBest = `<span class="cm">// Angular auto-sanitizes [innerHTML] — safe by default</span>
<span class="tag">&lt;div</span> <span class="attr">[innerHTML]</span>=<span class="str">"userContent"</span><span class="tag">&gt;&lt;/div&gt;</span>

<span class="cm">// Only bypass for HTML sourced from your own trusted server:</span>
safeHtml = <span class="kw">this</span>.sanitizer
  .<span class="fn">bypassSecurityTrustHtml</span>(serverRenderedHtml);
<span class="cm">// NEVER call this with direct user input</span>`;
}
