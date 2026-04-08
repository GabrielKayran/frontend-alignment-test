import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-bootstrap-app',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './bootstrap-app.component.html',
  styleUrl: './bootstrap-app.component.scss',
})
export class BootstrapAppComponent {
  readonly codeAnti = `<span class="cm">// NgModule boilerplate — required in Angular &lt;14</span>
<span class="tag">@NgModule</span>({
  declarations: [<span class="type">AppComponent</span>],
  imports: [<span class="type">BrowserModule</span>, <span class="type">HttpClientModule</span>],
  bootstrap: [<span class="type">AppComponent</span>],
})
<span class="kw">export class</span> <span class="type">AppModule</span> {}`;

  readonly codeBest = `<span class="cm">// Standalone bootstrap — no NgModule at all</span>
<span class="fn">bootstrapApplication</span>(<span class="type">AppComponent</span>, {
  providers: [
    <span class="fn">provideRouter</span>(routes),
    <span class="fn">provideHttpClient</span>(),
    <span class="fn">provideAnimations</span>(),
  ],
});`;
}
