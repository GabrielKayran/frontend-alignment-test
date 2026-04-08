import {
  Component,
  Injectable,
  Pipe,
  PipeTransform,
  afterEveryRender,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

// ── Shared call tracker ──────────────────────────────────────────────────────
// Plain class (no signals) so it's safe to call from inside pipe.transform()
// which runs during rendering. The component flushes counts in afterEveryRender.
@Injectable()
class PipeCallTracker {
  pendingCalls = 0;
  drain(): number {
    const n = this.pendingCalls;
    this.pendingCalls = 0;
    return n;
  }
}

// ── Pure pipe (best practice) ────────────────────────────────────────────────
@Pipe({ name: 'formatPrice', pure: true })
class FormatPricePipe implements PipeTransform {
  private readonly tracker = inject(PipeCallTracker);
  private readonly fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  transform(price: number): string {
    this.tracker.pendingCalls++;
    return this.fmt.format(price);
  }
}

// ── Demo data ────────────────────────────────────────────────────────────────
interface Product { id: number; name: string; price: number; }

const BASE_PRODUCTS: Product[] = [
  { id: 1, name: 'Angular Course',   price: 49.99 },
  { id: 2, name: 'RxJS Guide',       price: 29.99 },
  { id: 3, name: 'TypeScript Book',  price: 39.99 },
  { id: 4, name: 'Design System',    price: 99.99 },
  { id: 5, name: 'CLI Tools',        price: 19.99 },
];

// ── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-section-pure-pipe',
  standalone: true,
  imports: [FormatPricePipe, TranslatePipe],
  providers: [PipeCallTracker],
  templateUrl: './pure-pipe.component.html',
  styleUrl: './pure-pipe.component.scss',
})
export class PurePipeComponent {
  private readonly tracker = inject(PipeCallTracker);
  private readonly fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  protected readonly cdTriggerCount  = signal(0);
  protected readonly methodCallCount = signal(0);
  protected readonly pipeCallCount   = signal(0);
  protected readonly products        = signal<Product[]>([...BASE_PRODUCTS]);

  // Pending method calls buffered during rendering, flushed in afterEveryRender
  private pendingMethodCalls = 0;
  private skipUpdate = false;

  constructor() {
    afterEveryRender(() => {
      if (this.skipUpdate) { this.skipUpdate = false; return; }

      const methodPending = this.pendingMethodCalls;
      const pipePending   = this.tracker.drain();
      this.pendingMethodCalls = 0;

      if (methodPending > 0 || pipePending > 0) {
        this.skipUpdate = true;
        if (methodPending > 0) this.methodCallCount.update(n => n + methodPending);
        if (pipePending   > 0) this.pipeCallCount.update(n => n + pipePending);
      }
    });
  }

  // Anti-pattern side: plain method called on every CD cycle
  protected formatPriceMethod(price: number): string {
    this.pendingMethodCalls++;
    return this.fmt.format(price);
  }

  protected triggerCD(): void    { this.cdTriggerCount.update(n => n + 1); }
  protected changePrice(): void  {
    this.products.update(ps =>
      ps.map((p, i) => i === 0 ? { ...p, price: +(p.price + 10).toFixed(2) } : p),
    );
  }
  protected reset(): void {
    this.cdTriggerCount.set(0);
    this.methodCallCount.set(0);
    this.pipeCallCount.set(0);
    this.products.set([...BASE_PRODUCTS]);
  }

  readonly codeAnti = `<span class="cm">// Called on EVERY change detection cycle</span>
<span class="tag">&lt;span&gt;</span>{{ <span class="fn">formatPrice</span>(item.price) }}<span class="tag">&lt;/span&gt;</span>

<span class="fn">formatPrice</span>(price: <span class="type">number</span>): <span class="type">string</span> {
  <span class="kw">return new</span> <span class="type">Intl.NumberFormat</span>(<span class="str">'en-US'</span>, {
    style: <span class="str">'currency'</span>, currency: <span class="str">'USD'</span>,
  }).<span class="fn">format</span>(price);
}`;

  readonly codeBest = `<span class="cm">// Pure pipe — Angular memoizes by input reference</span>
<span class="tag">@Pipe</span>({ name: <span class="str">'formatPrice'</span>, pure: <span class="kw">true</span> })
<span class="kw">export class</span> <span class="type">FormatPricePipe</span> {
  <span class="fn">transform</span>(price: <span class="type">number</span>): <span class="type">string</span> {
    <span class="kw">return new</span> <span class="type">Intl.NumberFormat</span>(<span class="str">'en-US'</span>, {
      style: <span class="str">'currency'</span>, currency: <span class="str">'USD'</span>,
    }).<span class="fn">format</span>(price);
  }
}`;
}
