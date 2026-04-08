import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-route-input-binding',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './route-input-binding.component.html',
  styleUrl: './route-input-binding.component.scss',
})
export class RouteInputBindingComponent {
  readonly codeAnti = `<span class="cm">// Manual ActivatedRoute snapshot — verbose, imperative</span>
<span class="kw">export class</span> <span class="type">DetailComponent</span> {
  <span class="kw">private</span> route = <span class="fn">inject</span>(<span class="type">ActivatedRoute</span>);
  id!: <span class="type">string</span>;
  <span class="fn">ngOnInit</span>() {
    <span class="kw">this</span>.id = <span class="kw">this</span>.route.snapshot.params[<span class="str">'id'</span>];
  }
}`;

  readonly codeBest = `<span class="cm">// app.config.ts: provideRouter(routes, withComponentInputBinding())</span>
<span class="cm">// Route: { path: 'detail/:id', component: DetailComponent }</span>
<span class="kw">export class</span> <span class="type">DetailComponent</span> {
  <span class="cm">// Angular binds :id param automatically — no ActivatedRoute</span>
  <span class="kw">readonly</span> id = <span class="fn">input</span>&lt;<span class="type">string</span>&gt;();
}`;
}
