# Frontend Alignment Test

Interactive Angular 21 showcase created to support a technical discussion about frontend best practices with the China hub. The project turns common Angular decisions into side-by-side comparisons between anti-patterns and recommended approaches, with demos that make the impact visible in real time.

The showcase was assembled with support from Arthur Maia and focuses on topics that are relevant to modern Angular applications, especially performance, rendering behavior, state boundaries, and maintainability.

## Why this project exists

Instead of discussing best practices only at a conceptual level, this project was built to provide a concrete environment for the conversation. Each section highlights a specific frontend concern and shows how small implementation choices affect bundle size, change detection, DOM work, service lifetime, and reactive flows.

This is not a starter kit or a design system. It is a learning and alignment tool.

## What the showcase covers

The current version includes 11 sections:

1. `Getter vs Signal`
   Class getter re-evaluation on every change detection cycle versus `computed()` memoization.
2. `Lazy Loading`
   `loadChildren` with NgModules versus `loadComponent` with standalone components.
3. `Signal Encapsulation`
   Exposing `WritableSignal` directly versus `asReadonly()` and controlled mutations.
4. `Service Scope`
   Global singleton services versus component-scoped providers for ephemeral state.
5. `Input Debounce`
   Firing work on every keystroke versus `debounceTime()` and `distinctUntilChanged()`.
6. `track` in `@for`
   Tracking by `$index` versus stable identity with `item.id`.
7. `Observable Cleanup`
   Manual cleanup versus `takeUntilDestroyed()`.
8. `SharedModule Anti-pattern`
   Large shared module re-exports versus explicit standalone imports.
9. `@defer` Blocks
   Eager rendering versus declarative lazy template loading.
10. `OnPush Change Detection`
    Default strategy versus `ChangeDetectionStrategy.OnPush`.
11. `Forms Strategy`
    When reactive forms are a better fit than template-driven forms.

## Architecture highlights

- Angular 21 with standalone components across the app.
- Route-level lazy loading through `loadComponent`.
- SSR support with prerendering and an Express server entrypoint.
- Client hydration with event replay.
- `@ngx-translate` based internationalization with `en.US` and `pt-BR`.
- Interactive examples structured as isolated sections under a single showcase page.
- Vitest-based test execution through `ng test`.

## Tech stack

- Angular 21
- TypeScript 5.9
- RxJS 7
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
        defer-blocks/
        forms-strategy/
        getter-vs-signal/
        input-debounce/
        lazy-loading/
        observable-cleanup/
        on-push/
        service-scope/
        shared-module-pattern/
        signal-readonly/
        track-for/
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
