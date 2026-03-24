import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface DemoItem {
  id: number;
  nameKey: string;
  nameParams?: { id: number };
  renders: number;
}

const INITIAL_ITEMS: DemoItem[] = [
  { id: 1, nameKey: 'sections.trackFor.demo.items.designTokens', renders: 1 },
  { id: 2, nameKey: 'sections.trackFor.demo.items.authMiddleware', renders: 1 },
  { id: 3, nameKey: 'sections.trackFor.demo.items.apiRateLimiting', renders: 1 },
  { id: 4, nameKey: 'sections.trackFor.demo.items.unitTestCoverage', renders: 1 },
  { id: 5, nameKey: 'sections.trackFor.demo.items.dockerSetup', renders: 1 },
];

@Component({
  selector: 'app-section-track-for',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './track-for.component.html',
  styleUrl: './track-for.component.scss',
})
export class TrackForComponent {
  private nextBadId = 6;
  private nextGoodId = 6;

  protected badItems = signal<DemoItem[]>(INITIAL_ITEMS.map((item) => ({ ...item })));
  protected goodItems = signal<DemoItem[]>(INITIAL_ITEMS.map((item) => ({ ...item })));

  protected badOps = signal(5);
  protected goodOps = signal(5);

  protected addBad(): void {
    const id = this.nextBadId++;
    const item: DemoItem = {
      id,
      nameKey: 'sections.trackFor.demo.items.generatedTask',
      nameParams: { id },
      renders: 0,
    };

    this.badItems.update((items) =>
      [item, ...items].map((entry) => ({ ...entry, renders: entry.renders + 1 })),
    );
    this.badOps.update((count) => count + this.badItems().length);
  }

  protected addGood(): void {
    const id = this.nextGoodId++;
    const item: DemoItem = {
      id,
      nameKey: 'sections.trackFor.demo.items.generatedTask',
      nameParams: { id },
      renders: 1,
    };

    this.goodItems.update((items) => [item, ...items]);
    this.goodOps.update((count) => count + 1);
  }

  protected shuffleBad(): void {
    this.badItems.update((items) => {
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      return shuffledItems.map((item) => ({ ...item, renders: item.renders + 1 }));
    });
    this.badOps.update((count) => count + this.badItems().length);
  }

  protected shuffleGood(): void {
    this.goodItems.update((items) => [...items].sort(() => Math.random() - 0.5));
  }

  protected resetDemo(): void {
    this.nextBadId = 6;
    this.nextGoodId = 6;
    this.badItems.set(INITIAL_ITEMS.map((item) => ({ ...item })));
    this.goodItems.set(INITIAL_ITEMS.map((item) => ({ ...item })));
    this.badOps.set(5);
    this.goodOps.set(5);
  }

  readonly codeAnti = `<span class="cm">// âŒ track $index â€” position as identity</span>
<span class="tag">@for</span> (<span class="kw">item of</span> tasks(); <span class="kw">track</span> <span class="attr">$index</span>) {
  <span class="tag">&lt;app-task-card</span> <span class="attr">[task]</span>=<span class="str">"item"</span> <span class="tag">/&gt;</span>
}

<span class="cm">// On prepend, shuffle or mid-list removal:</span>
<span class="cm">// Angular re-processes ALL N views â€” O(n) DOM operations.</span>
<span class="cm">// DOM state (typed inputs, animations) does not follow the item.</span>`;

  readonly codeBest = `<span class="cm">// âœ… track item.id â€” stable identity per item</span>
<span class="tag">@for</span> (<span class="kw">item of</span> tasks(); <span class="kw">track</span> <span class="attr">item.id</span>) {
  <span class="tag">&lt;app-task-card</span> <span class="attr">[task]</span>=<span class="str">"item"</span> <span class="tag">/&gt;</span>
}

<span class="cm">// On prepend: Angular creates 1 new view â€” O(1) DOM creation.</span>
<span class="cm">// On shuffle: reorders DOM nodes without re-rendering â€” O(n) moves.</span>
<span class="cm">// DOM state correctly follows each item in both cases.</span>`;
}
