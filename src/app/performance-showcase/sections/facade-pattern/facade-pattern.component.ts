import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-facade-pattern',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './facade-pattern.component.html',
  styleUrl: './facade-pattern.component.scss',
})
export class FacadePatternComponent {
  readonly codeAnti = `<span class="cm">// Component knows too much — coupled to 3 services</span>
<span class="kw">export class</span> <span class="type">CheckoutComponent</span> {
  <span class="kw">private</span> cart = <span class="fn">inject</span>(<span class="type">CartService</span>);
  <span class="kw">private</span> user = <span class="fn">inject</span>(<span class="type">UserService</span>);
  <span class="kw">private</span> inv  = <span class="fn">inject</span>(<span class="type">InventoryService</span>);

  <span class="fn">checkout</span>() {
    <span class="kw">this</span>.inv.<span class="fn">reserve</span>(<span class="kw">this</span>.cart.<span class="fn">items</span>());
    <span class="kw">this</span>.cart.<span class="fn">clear</span>();
    <span class="kw">this</span>.user.<span class="fn">addOrder</span>(<span class="kw">this</span>.cart.<span class="fn">total</span>());
  }
}`;

  readonly codeBest = `<span class="cm">// Component depends on one facade — orchestration is encapsulated</span>
<span class="kw">export class</span> <span class="type">CheckoutComponent</span> {
  <span class="kw">private</span> facade = <span class="fn">inject</span>(<span class="type">CheckoutFacade</span>);

  <span class="fn">checkout</span>() { <span class="kw">this</span>.facade.<span class="fn">checkout</span>(); }
}

<span class="cm">// CheckoutFacade orchestrates Cart, User, Inventory internally</span>`;
}
