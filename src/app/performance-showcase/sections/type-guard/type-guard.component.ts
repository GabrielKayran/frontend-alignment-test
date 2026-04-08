import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-type-guard',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './type-guard.component.html',
  styleUrl: './type-guard.component.scss',
})
export class TypeGuardComponent {
  readonly codeAnti = `<span class="cm">// any disables all type checking — unsafe property access</span>
<span class="kw">function</span> <span class="fn">process</span>(value: <span class="type">any</span>) {
  <span class="fn">console</span>.<span class="fn">log</span>(value.name); <span class="cm">// no error even if undefined</span>
  value.<span class="fn">nonExistent</span>();   <span class="cm">// runtime crash, not compile error</span>
}`;

  readonly codeBest = `<span class="cm">// unknown forces explicit narrowing before use</span>
<span class="kw">function</span> <span class="fn">isUser</span>(v: <span class="type">unknown</span>): v <span class="kw">is</span> <span class="type">User</span> {
  <span class="kw">return</span> <span class="kw">typeof</span> v === <span class="str">'object'</span> && v !== <span class="kw">null</span>
    && <span class="str">'name'</span> <span class="kw">in</span> v;
}
<span class="kw">function</span> <span class="fn">process</span>(value: <span class="type">unknown</span>) {
  <span class="kw">if</span> (<span class="fn">isUser</span>(value)) <span class="fn">console</span>.<span class="fn">log</span>(value.name); <span class="cm">// safe</span>
}`;
}
