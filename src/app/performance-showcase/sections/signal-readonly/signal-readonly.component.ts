import { Component } from '@angular/core';

@Component({
  selector: 'app-section-signal-readonly',
  standalone: true,
  imports: [],
  templateUrl: './signal-readonly.component.html',
  styleUrl: './signal-readonly.component.scss',
})
export class SignalReadonlyComponent {

  readonly codeAnti = `<span class="cm">// Anti-pattern: exposing WritableSignal lets ANY consumer mutate state</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">UserService</span> {
  <span class="kw">readonly</span> user: <span class="type">WritableSignal</span>&lt;<span class="type">User</span>&gt; = <span class="fn">signal</span>(<span class="kw">null</span>);
}

<span class="cm">// Any component can now do:</span>
<span class="kw">this</span>.userService.user.<span class="fn">set</span>({ name: <span class="str">'Hacker'</span> }); <span class="cm">// uncontrolled mutation</span>`;

  readonly codeBest = `<span class="cm">// Service owns mutations internally; exposes only a readonly view</span>
<span class="kw">@Injectable</span>({ providedIn: <span class="str">'root'</span> })
<span class="kw">export class</span> <span class="type">UserService</span> {
  <span class="kw">private readonly</span> _user = <span class="fn">signal</span>&lt;<span class="type">User | null</span>&gt;(<span class="kw">null</span>);
  <span class="kw">readonly</span> user = <span class="kw">this</span>._user.<span class="fn">asReadonly</span>();

  <span class="fn">loadUser</span>(id: <span class="type">string</span>): <span class="type">void</span> {
    <span class="cm">// Only this service can set _user</span>
    <span class="kw">this</span>._user.<span class="fn">set</span>(<span class="cm">/* fetched data */</span>);
  }
}`;
}
