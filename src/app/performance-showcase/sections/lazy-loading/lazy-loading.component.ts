import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-lazy-loading',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './lazy-loading.component.html',
  styleUrl: './lazy-loading.component.scss',
})
export class LazyLoadingComponent {
  readonly codeAnti = `<span class="cm">// Old approach — requires a full NgModule wrapper</span>
<span class="kw">const</span> routes: <span class="type">Routes</span> = [{
  path: <span class="str">'dashboard'</span>,
  loadChildren: () =>
    <span class="fn">import</span>(<span class="str">'./dashboard/dashboard.module'</span>)
      .<span class="fn">then</span>(m => m.<span class="type">DashboardModule</span>),
}];

<span class="cm">// DashboardModule must declare and export DashboardComponent,</span>
<span class="cm">// pulling in the entire module graph even for a single page.</span>`;

  readonly codeBest = `<span class="cm">// Modern approach — load the standalone component directly</span>
<span class="kw">const</span> routes: <span class="type">Routes</span> = [{
  path: <span class="str">'dashboard'</span>,
  loadComponent: () =>
    <span class="fn">import</span>(<span class="str">'./dashboard/dashboard.component'</span>)
      .<span class="fn">then</span>(m => m.<span class="type">DashboardComponent</span>),
}];

<span class="cm">// No NgModule overhead. Angular splits exactly this component</span>
<span class="cm">// into its own chunk — smaller, faster initial load.</span>`;
}
