# Frontend Alignment Test

Interactive Angular 21 showcase created to support a technical discussion about frontend best practices with the China hub. The project turns common Angular decisions into side-by-side comparisons between anti-patterns and recommended approaches, with demos that make the impact visible in real time.

The showcase was assembled with support from Arthur Maia and focuses on topics that are relevant to modern Angular applications, especially performance, rendering behavior, state boundaries, and maintainability.

## Why this project exists

Instead of discussing best practices only at a conceptual level, this project was built to provide a concrete environment for the conversation. Each section highlights a specific frontend concern and shows how small implementation choices affect bundle size, change detection, DOM work, service lifetime, and reactive flows.

This is not a starter kit or a design system. It is a learning and alignment tool.

## What the showcase covers

The current version includes 33 sections across 7 categories.

### Performance

1. `Getter vs Signal`
   Class getter re-evaluation on every change detection cycle versus `computed()` memoization. Live demo with CD trigger counter.
2. `Lazy Loading`
   `loadChildren` with NgModules versus `loadComponent` with standalone components.
3. `Signal Encapsulation`
   Exposing `WritableSignal` directly versus `asReadonly()` and controlled mutations.
4. `Service Scope`
   Global singleton services versus component-scoped providers for ephemeral state.
5. `Input Debounce`
   Firing work on every keystroke versus `debounceTime()` and `distinctUntilChanged()`.
6. `track in @for`
   Tracking by `$index` versus stable identity with `item.id`.
7. `Observable Cleanup`
   Manual cleanup versus `takeUntilDestroyed()`.
8. `SharedModule Anti-pattern`
   Large shared module re-exports versus explicit standalone imports.
9. `@defer Blocks`
   Eager rendering versus declarative lazy template loading.
10. `OnPush Change Detection`
    Default strategy versus `ChangeDetectionStrategy.OnPush`. Live demo with render counters.
11. `Forms Strategy`
    When reactive forms are a better fit than template-driven forms.
12. `NgOptimizedImage`
    Plain `<img>` versus the `NgOptimizedImage` directive. Live demo showing actual images with attribute badges (`loading`, `fetchpriority`, `width/height`).
13. `Virtual Scroll`
    Rendering all rows in the DOM versus CDK `cdk-virtual-scroll-viewport`. Live demo with 1 000 items: left renders 200 nodes eagerly, right renders ~10 at any time.
14. `Pure Pipe`
    Method call in template versus `pure: true` pipe. Live demo with call counters — identical to the getter-vs-signal concept applied to transform functions.

### State / Reactivity

15. `toSignal()`
    Manual `subscribe()` + property assignment versus `toSignal()` for automatic conversion.
16. `effect() vs computed()`
    Using `effect()` to derive state (anti-pattern) versus `computed()`. Live demo with an evaluation log showing that `computed()` runs synchronously during rendering while `effect()` fires after the render and causes an extra CD cycle.
17. `linkedSignal()`
    A separate signal plus an `effect()` to keep them in sync versus `linkedSignal()` for a derived but writable signal that resets automatically when its source changes.
18. `Signal Input`
    `@Input()` decorator (not reactive, requires `ngOnChanges`) versus `input()` signal function (reactive, composable with `computed()`).

### Architecture

19. `Facade Pattern`
    Component injecting multiple unrelated services directly versus a single facade that orchestrates them internally.
20. `Smart / Dumb Components`
    Presentational component fetching its own data versus a smart parent fetching and passing data via `input()`.
21. `InjectionToken`
    Hardcoded `environment.apiUrl` in a service versus an `InjectionToken` with a factory for testable, swappable configuration.
22. `Folder Structure`
    Type-based folder layout (`components/`, `services/`, `pipes/`) versus feature-based layout (`feature/auth/`, `feature/cart/`) shown as annotated folder trees.

### Security

23. `bypassSecurityTrustHtml`
    Bypassing Angular's sanitizer versus letting `[innerHTML]` sanitize automatically.
24. `HttpOnly Cookie vs localStorage`
    Storing tokens in `localStorage` (accessible via JS, XSS-vulnerable) versus server-set `HttpOnly; Secure; SameSite=Strict` cookies.

### Typing

25. `HttpClient with Generics`
    Untyped `http.get()` returning `Observable<Object>` versus `http.get<User[]>()` for compile-time safety.
26. `output() vs EventEmitter`
    `@Output() selected = new EventEmitter<Item>()` versus `selected = output<Item>()`.
27. `unknown + Type Guard vs any`
    `function process(value: any)` versus `unknown` with a narrowing type guard.

### DX

28. `inject() vs Constructor Injection`
    Constructor parameter injection versus `inject()` — composable, usable outside class constructors.
29. `withComponentInputBinding()`
    Reading route params via `ActivatedRoute.snapshot` versus automatic binding through `withComponentInputBinding()` + `input()`.
30. `bootstrapApplication vs AppModule`
    NgModule-based bootstrap with `platformBrowserDynamic().bootstrapModule()` versus `bootstrapApplication()` with `provideRouter()` and `provideHttpClient()`.

### RxJS

31. `RxJS Flattening Operators`
    Semantic choice between `switchMap` (cancel previous — search), `concatMap` (queue — ordered writes), and `mergeMap` (concurrent — parallel reads). Three-panel comparison.
32. `combineLatest vs withLatestFrom`
    Nested `subscribe()` inside `subscribe()` versus `combineLatest()` (re-emits on any source) and `withLatestFrom()` (samples on primary only).
33. `Higher-Order Observables`
    Nested `subscribe()` callback hell versus a flat `switchMap()` pipeline with automatic inner subscription management.

## Architecture highlights

- Angular 21 with standalone components across the app.
- Route-level lazy loading through `loadComponent`.
- SSR support with prerendering and an Express server entrypoint.
- Client hydration with event replay.
- `@ngx-translate` based internationalization with `en.US` and `pt-BR`.
- Interactive examples structured as isolated sections under a single showcase page.
- CDK virtual scroll (`@angular/cdk`) for the virtual scroll section.
- Vitest-based test execution through `ng test`.

## Tech stack

- Angular 21
- TypeScript 5.9
- RxJS 7
- Angular CDK
- Angular SSR
- Express
- `@ngx-translate/core`
- Vitest

## Project structure

```text
src/
  app/
    i18n/
      language.service.ts
    performance-showcase/
      sections/
        bypass-security/
        bootstrap-app/
        combine-latest/
        defer-blocks/
        effect-vs-computed/
        facade-pattern/
        folder-structure/
        forms-strategy/
        getter-vs-signal/
        higher-order-rxjs/
        http-client-generics/
        http-only-cookie/
        inject-fn/
        injection-token/
        input-debounce/
        lazy-loading/
        linked-signal/
        ng-optimized-image/
        observable-cleanup/
        on-push/
        output-fn/
        pure-pipe/
        route-input-binding/
        rxjs-flattening/
        service-scope/
        shared-module-pattern/
        signal-input/
        signal-readonly/
        smart-dumb/
        to-signal/
        track-for/
        type-guard/
        virtual-scroll/
    shared/
      language-switcher/
```

## Getting started

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Open `http://localhost:4200/`.

## Available scripts

### `npm start`

Starts the local development server with live reload.

### `npm run build`

Builds the browser and server bundles in `dist/frontend-alignment-test/`.

### `npm run watch`

Builds the project in watch mode using the development configuration.

### `npm test`

Runs the test suite with Vitest through Angular CLI.

### `npm run serve:ssr:frontend-alignment-test`

Serves the generated SSR build from `dist/frontend-alignment-test/server/server.mjs`.

Use it after a successful production build:

```bash
npm run build
npm run serve:ssr:frontend-alignment-test
```

## Internationalization

Translations live under `public/assets/i18n/`:

- `en.US.json`
- `pt-BR.json`

Language selection is handled by `LanguageService`, which:

- registers supported languages
- restores the stored browser preference
- updates the document `lang` attribute
- persists changes in local storage on the client

## Notes for contributors

- Keep each showcase section focused on one decision or tradeoff.
- Prefer interactive demonstrations over static explanation when possible.
- If you add a new section, make the anti-pattern and the recommended approach equally clear.
- Reuse the existing section layout so the comparison remains consistent across the page.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
