import { Component } from '@angular/core';

@Component({
  selector: 'app-section-shared-module-pattern',
  standalone: true,
  imports: [],
  templateUrl: './shared-module-pattern.component.html',
  styleUrl: './shared-module-pattern.component.scss',
})
export class SharedModulePatternComponent {

  readonly codeAnti = `<span class="cm">// SharedModule bundles everything together — a common anti-pattern</span>
<span class="kw">@NgModule</span>({
  declarations: [
    <span class="type">ButtonComponent</span>, <span class="type">CardComponent</span>, <span class="type">TableComponent</span>,
    <span class="type">SpinnerComponent</span>, <span class="type">TooltipComponent</span>, <span class="cm">// ... 30 more</span>
  ],
  exports: [
    <span class="type">ButtonComponent</span>, <span class="type">CardComponent</span>, <span class="type">TableComponent</span>,
    <span class="type">CommonModule</span>, <span class="type">FormsModule</span>, <span class="cm">// ← forces every consumer</span>
  ],                            <span class="cm">// to load ALL of these</span>
})
<span class="kw">export class</span> <span class="type">SharedModule</span> {}`;

  readonly codeBest = `<span class="cm">// Standalone components: each imports ONLY what it needs</span>
<span class="kw">@Component</span>({
  selector: <span class="str">'app-dashboard'</span>,
  standalone: <span class="kw">true</span>,
  imports: [
    <span class="type">ButtonComponent</span>,   <span class="cm">// only these two are bundled</span>
    <span class="type">CardComponent</span>,
  ],
  templateUrl: <span class="str">'./dashboard.component.html'</span>,
  styleUrl: <span class="str">'./dashboard.component.scss'</span>,
})
<span class="kw">export class</span> <span class="type">DashboardComponent</span> {}

<span class="cm">// SpinnerComponent, TableComponent etc. are NOT included —</span>
<span class="cm">// they won't bloat this chunk at all.</span>`;
}
