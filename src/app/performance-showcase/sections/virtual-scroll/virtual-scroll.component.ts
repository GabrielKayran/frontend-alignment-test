import { Component } from '@angular/core';
import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';

interface ListItem {
  id: number;
  label: string;
  value: number;
}

const ALL_ITEMS: ListItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  label: `Item #${String(i + 1).padStart(4, '0')}`,
  value: Math.round(Math.random() * 9_000 + 1_000),
}));

@Component({
  selector: 'app-section-virtual-scroll',
  standalone: true,
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, TranslatePipe],
  templateUrl: './virtual-scroll.component.html',
  styleUrl: './virtual-scroll.component.scss',
})
export class VirtualScrollComponent {
  // Anti: 200 rendered items — already heavy; 1000 would lock the browser
  protected readonly antiItems: ListItem[] = ALL_ITEMS.slice(0, 200);
  // Best: all 1000 items, only ~10 in DOM at once
  protected readonly virtualItems: ListItem[] = ALL_ITEMS;

  readonly codeAnti = `<span class="cm">// Renders ALL rows in the DOM immediately</span>
<span class="tag">@for</span> (item <span class="kw">of</span> items; <span class="fn">track</span> item.id) {
  <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="str">"row"</span><span class="tag">&gt;</span>{{ item.label }}<span class="tag">&lt;/div&gt;</span>
}
<span class="cm">// 1 000 items → 1 000 DOM nodes in memory at once</span>`;

  readonly codeBest = `<span class="cm">// CDK Virtual Scroll — only visible rows in DOM</span>
<span class="tag">&lt;cdk-virtual-scroll-viewport</span> <span class="attr">itemSize</span>=<span class="str">"40"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;div</span> <span class="attr">*cdkVirtualFor</span>=<span class="str">"let item of items"</span><span class="tag">&gt;</span>
    {{ item.label }}
  <span class="tag">&lt;/div&gt;</span>
<span class="tag">&lt;/cdk-virtual-scroll-viewport&gt;</span>
<span class="cm">// 1 000 items → ~10 DOM nodes regardless of size</span>`;
}
