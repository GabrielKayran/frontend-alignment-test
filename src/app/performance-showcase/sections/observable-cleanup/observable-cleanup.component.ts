import { Component } from '@angular/core';

@Component({
  selector: 'app-section-observable-cleanup',
  standalone: true,
  imports: [],
  templateUrl: './observable-cleanup.component.html',
  styleUrl: './observable-cleanup.component.scss',
})
export class ObservableCleanupComponent {

  readonly codeAnti = `<span class="cm">// Manual unsubscribe — easy to forget, verbose</span>
<span class="kw">private</span> sub!: <span class="type">Subscription</span>;

<span class="fn">ngOnInit</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.sub = <span class="kw">this</span>.stream$.<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
}

<span class="fn">ngOnDestroy</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.sub.<span class="fn">unsubscribe</span>(); <span class="cm">// easy to forget one</span>
}`;

  readonly codeMiddle = `<span class="cm">// takeUntil pattern — better, but requires boilerplate Subject</span>
<span class="kw">private readonly</span> destroy$ = <span class="kw">new</span> <span class="type">Subject</span>&lt;<span class="type">void</span>&gt;();

<span class="fn">ngOnInit</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.stream$
    .<span class="fn">pipe</span>(<span class="fn">takeUntil</span>(<span class="kw">this</span>.destroy$))
    .<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
}

<span class="fn">ngOnDestroy</span>(): <span class="type">void</span> {
  <span class="kw">this</span>.destroy$.<span class="fn">next</span>();
  <span class="kw">this</span>.destroy$.<span class="fn">complete</span>();
}`;

  readonly codeBest = `<span class="cm">// takeUntilDestroyed (Angular 16+) — no Subject, no ngOnDestroy</span>
<span class="kw">export class</span> <span class="type">MyComponent</span> {
  <span class="kw">private readonly</span> destroyRef = <span class="fn">inject</span>(<span class="type">DestroyRef</span>);

  <span class="kw">constructor</span>() {
    <span class="cm">// Works in inject() context — even outside ngOnInit</span>
    <span class="kw">this</span>.stream$
      .<span class="fn">pipe</span>(<span class="fn">takeUntilDestroyed</span>(<span class="kw">this</span>.destroyRef))
      .<span class="fn">subscribe</span>({ next: v => <span class="fn">doWork</span>(v) });
  }
}`;
}
