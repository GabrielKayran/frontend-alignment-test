import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-output-fn',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './output-fn.component.html',
  styleUrl: './output-fn.component.scss',
})
export class OutputFnComponent {
  readonly codeAnti = `<span class="cm">// Decorator-based — verbose, class-based EventEmitter</span>
<span class="tag">@Output</span>() selected = <span class="kw">new</span> <span class="type">EventEmitter</span>&lt;<span class="type">Item</span>&gt;();
<span class="tag">@Output</span>() removed = <span class="kw">new</span> <span class="type">EventEmitter</span>&lt;<span class="type">string</span>&gt;();

<span class="fn">select</span>(item: <span class="type">Item</span>) { <span class="kw">this</span>.selected.<span class="fn">emit</span>(item); }`;

  readonly codeBest = `<span class="cm">// Function-based output — no decorator, no EventEmitter import</span>
<span class="kw">readonly</span> selected = <span class="fn">output</span>&lt;<span class="type">Item</span>&gt;();
<span class="kw">readonly</span> removed  = <span class="fn">output</span>&lt;<span class="type">string</span>&gt;();

<span class="fn">select</span>(item: <span class="type">Item</span>) { <span class="kw">this</span>.selected.<span class="fn">emit</span>(item); }`;
}
