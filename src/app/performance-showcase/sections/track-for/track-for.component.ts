import { Component, signal } from '@angular/core';

interface DemoItem {
  id: number;
  name: string;
  renders: number;
}

const INITIAL_ITEMS: DemoItem[] = [
  { id: 1, name: 'Design tokens', renders: 1 },
  { id: 2, name: 'Auth middleware', renders: 1 },
  { id: 3, name: 'API rate limiting', renders: 1 },
  { id: 4, name: 'Unit test coverage', renders: 1 },
  { id: 5, name: 'Docker setup', renders: 1 },
];

@Component({
  selector: 'app-section-track-for',
  standalone: true,
  imports: [],
  templateUrl: './track-for.component.html',
  styleUrl: './track-for.component.scss',
})
export class TrackForComponent {

  private _nextBadId = 6;
  private _nextGoodId = 6;

  protected badItems = signal<DemoItem[]>(INITIAL_ITEMS.map(i => ({ ...i })));
  protected goodItems = signal<DemoItem[]>(INITIAL_ITEMS.map(i => ({ ...i })));

  protected badOps = signal(5);
  protected goodOps = signal(5);

  protected addBad(): void {
    const id = this._nextBadId++;
    const item: DemoItem = { id, name: `Task #${id}`, renders: 0 };
    // Simulates track $index: a list change forces Angular to re-evaluate ALL views
    // because it can only match items by position, not by identity.
    this.badItems.update(items =>
      [item, ...items].map(i => ({ ...i, renders: i.renders + 1 }))
    );
    this.badOps.update(n => n + this.badItems().length);
  }

  protected addGood(): void {
    const id = this._nextGoodId++;
    const item: DemoItem = { id, name: `Task #${id}`, renders: 1 };
    // Simulates track item.id: Angular creates exactly 1 new view.
    // Existing views just shift their position in the DOM — no re-render.
    this.goodItems.update(items => [item, ...items]);
    this.goodOps.update(n => n + 1);
  }

  protected shuffleBad(): void {
    // With $index: a reorder looks like N full item replacements to Angular.
    this.badItems.update(items => {
      const arr = [...items].sort(() => Math.random() - 0.5);
      return arr.map(i => ({ ...i, renders: i.renders + 1 }));
    });
    this.badOps.update(n => n + this.badItems().length);
  }

  protected shuffleGood(): void {
    // With item.id: Angular recognises the same IDs and simply reorders DOM nodes.
    // Zero re-renders, zero DOM mutations beyond moving nodes.
    this.goodItems.update(items => [...items].sort(() => Math.random() - 0.5));
  }

  protected resetDemo(): void {
    this._nextBadId = 6;
    this._nextGoodId = 6;
    this.badItems.set(INITIAL_ITEMS.map(i => ({ ...i })));
    this.goodItems.set(INITIAL_ITEMS.map(i => ({ ...i })));
    this.badOps.set(5);
    this.goodOps.set(5);
  }

  readonly codeAnti = `<span class="cm">// ❌ track $index — position as identity</span>
<span class="tag">@for</span> (<span class="kw">item of</span> tasks(); <span class="kw">track</span> <span class="attr">$index</span>) {
  <span class="tag">&lt;app-task-card</span> <span class="attr">[task]</span>=<span class="str">"item"</span> <span class="tag">/&gt;</span>
}

<span class="cm">// On prepend, shuffle or mid-list removal:</span>
<span class="cm">// Angular re-processes ALL N views — O(n) DOM operations.</span>
<span class="cm">// DOM state (typed inputs, animations) does not follow the item.</span>`;

  readonly codeBest = `<span class="cm">// ✅ track item.id — stable identity per item</span>
<span class="tag">@for</span> (<span class="kw">item of</span> tasks(); <span class="kw">track</span> <span class="attr">item.id</span>) {
  <span class="tag">&lt;app-task-card</span> <span class="attr">[task]</span>=<span class="str">"item"</span> <span class="tag">/&gt;</span>
}

<span class="cm">// On prepend: Angular creates 1 new view — O(1) DOM creation.</span>
<span class="cm">// On shuffle: reorders DOM nodes without re-rendering — O(n) moves.</span>
<span class="cm">// DOM state correctly follows each item in both cases.</span>`;
}
