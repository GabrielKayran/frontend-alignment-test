import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-section-forms-strategy',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms-strategy.component.html',
  styleUrl: './forms-strategy.component.scss',
})
export class FormsStrategyComponent {

  private readonly fb = inject(FormBuilder);

  protected readonly reactiveForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected readonly submitted = signal(false);

  protected submit(): void {
    if (this.reactiveForm.valid) {
      this.submitted.set(true);
    } else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  readonly codeAnti = `<span class="cm">// Template-driven for complex validation — hard to test, hard to compose</span>
<span class="tag">&lt;form</span> <span class="attr">#f</span>=<span class="str">"ngForm"</span> <span class="attr">(ngSubmit)</span>=<span class="str">"submit(f)"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;input</span> <span class="attr">name</span>=<span class="str">"email"</span> <span class="attr">[(ngModel)]</span>=<span class="str">"email"</span>
         <span class="attr">required</span> <span class="attr">email</span> <span class="attr">#emailCtrl</span>=<span class="str">"ngModel"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;span</span> <span class="attr">*ngIf</span>=<span class="str">"emailCtrl.invalid &amp;&amp; emailCtrl.touched"</span><span class="tag">&gt;</span>
    Invalid email <span class="cm">&lt;!-- validation logic hidden in template --&gt;</span>
  <span class="tag">&lt;/span&gt;</span>
<span class="tag">&lt;/form&gt;</span>`;

  readonly codeBest = `<span class="cm">// Reactive form: validation in TypeScript, easy to test and compose</span>
<span class="kw">protected readonly</span> form = <span class="kw">this</span>.fb.<span class="fn">group</span>({
  email: [<span class="str">''</span>, [<span class="type">Validators</span>.required, <span class="type">Validators</span>.email]],
  username: [<span class="str">''</span>, [<span class="type">Validators</span>.required, <span class="type">Validators</span>.minLength(<span class="num">3</span>)]],
});

<span class="cm">// Validation is explicit, type-safe, and trivially unit-testable.</span>
<span class="cm">// Use ngModel only for simple, standalone inputs.</span>`;
}
