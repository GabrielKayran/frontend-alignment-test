import { Component } from '@angular/core';

@Component({
  selector: 'app-section-service-scope',
  standalone: true,
  imports: [],
  templateUrl: './service-scope.component.html',
  styleUrl: './service-scope.component.scss',
})
export class ServiceScopeComponent {

  readonly codeAnti = `<span class="cm">// providedIn: 'root' creates a singleton that lives for the entire app.</span>
<span class="cm">// Fine for global services, but wrong for wizard/form state.</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">WizardStateService</span> {
  currentStep = <span class="fn">signal</span>(<span class="num">0</span>);
  formData = <span class="fn">signal</span>({});
  <span class="cm">// Lives forever — state leaks between wizard sessions!</span>
}`;

  readonly codeBest = `<span class="cm">// Component-level provider: created when component mounts,</span>
<span class="cm">// destroyed when it unmounts. State resets automatically.</span>
<span class="kw">@Component</span>({
  selector: <span class="str">'app-wizard'</span>,
  providers: [<span class="type">WizardStateService</span>], <span class="cm">// scoped to this component subtree</span>
  templateUrl: <span class="str">'./wizard.component.html'</span>,
  styleUrl: <span class="str">'./wizard.component.scss'</span>,
})
<span class="kw">export class</span> <span class="type">WizardComponent</span> {
  <span class="cm">// WizardStateService is injected as a fresh instance here</span>
  <span class="kw">private readonly</span> state = <span class="fn">inject</span>(<span class="type">WizardStateService</span>);
}`;
}
