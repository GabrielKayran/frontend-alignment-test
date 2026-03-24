import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-defer-blocks',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './defer-blocks.component.html',
  styleUrl: './defer-blocks.component.scss',
})
export class DeferBlocksComponent {
  readonly codeAnti = `<span class="cm">// ❌ Eager loading — full bundle sent to the client</span>
<span class="cm">// even if the component is below the fold or rarely used</span>
<span class="tag">&lt;app-heavy-chart</span> <span class="attr">[data]</span>=<span class="str">"analytics()"</span> <span class="tag">/&gt;</span>
<span class="tag">&lt;app-rich-text-editor</span> <span class="attr">[content]</span>=<span class="str">"post()"</span> <span class="tag">/&gt;</span>
<span class="tag">&lt;app-data-grid</span> <span class="attr">[rows]</span>=<span class="str">"rows()"</span> <span class="tag">/&gt;</span>

<span class="cm">// All JS/CSS for these components is downloaded on initial load.</span>
<span class="cm">// The user pays the cost even if they never scroll there.</span>`;

  readonly codeBest = `<span class="cm">// ✅ @defer — declarative lazy loading in the template</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">viewport</span>) {
  <span class="tag">&lt;app-heavy-chart</span> <span class="attr">[data]</span>=<span class="str">"analytics()"</span> <span class="tag">/&gt;</span>
} <span class="tag">@placeholder</span> {
  <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="str">"chart-skeleton"</span><span class="tag">&gt;</span>Loading chart…<span class="tag">&lt;/div&gt;</span>
} <span class="tag">@loading</span> (<span class="kw">minimum</span> <span class="num">300ms</span>) {
  <span class="tag">&lt;app-spinner</span> <span class="tag">/&gt;</span>
} <span class="tag">@error</span> {
  <span class="tag">&lt;p</span><span class="tag">&gt;</span>Failed to load the chart.<span class="tag">&lt;/p&gt;</span>
}

<span class="cm">// The heavy-chart JS is downloaded only when the block</span>
<span class="cm">// enters the viewport — no extra bundling config required.</span>`;

  readonly codeTriggers = `<span class="cm">// Available triggers — can be combined</span>

<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">idle</span>) {      <span class="cm">// when the browser is idle (requestIdleCallback)</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">viewport</span>) {   <span class="cm">// when the placeholder enters the viewport</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">interaction</span>) { <span class="cm">// on click/focus on the placeholder</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">hover</span>) {      <span class="cm">// on mouse hover over the placeholder</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">timer</span>(<span class="num">2s</span>)) {  <span class="cm">// after 2 seconds from render</span>
<span class="tag">@defer</span> (<span class="kw">when</span> isAdmin()) { <span class="cm">// when the expression becomes truthy</span>

<span class="cm">// Combination: idle AND viewport</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">idle</span>; <span class="kw">on</span> <span class="fn">viewport</span>) {
  <span class="tag">&lt;app-analytics-dashboard</span> <span class="tag">/&gt;</span>
}

<span class="cm">// Eager prefetch — downloads JS without rendering yet</span>
<span class="tag">@defer</span> (<span class="kw">on</span> <span class="fn">interaction</span>; <span class="kw">prefetch on</span> <span class="fn">idle</span>) {
  <span class="tag">&lt;app-rich-editor</span> <span class="tag">/&gt;</span>
}`;
}
