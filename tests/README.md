# Tests

Automated tests for NoteMatch, using [Vitest](https://vitest.dev) +
[React Testing Library](https://testing-library.com/react) (jsdom).

## Running

```bash
npm test            # run everything once
npm run test:watch  # watch mode
npm run test:coverage  # run with a coverage report (text + html in coverage/)
```

## Layout

Tests live under `tests/`, mirroring `src/`, so business logic is tested once
and never duplicated across layers:

| Folder              | What it covers                                                        |
| ------------------- | --------------------------------------------------------------------- |
| `tests/lib/`        | Pure business logic — recommendation engine, catalog helpers, lead validation. |
| `tests/api/`        | Route handlers — request validation and wiring only (logic is covered in `lib`). |
| `tests/components/` | React components — rendering and user interaction (form, results, compare, chat). |
| `tests/helpers/`    | Shared test factories (e.g. `makeNotebook`). Not test files themselves. |

## Conventions

- Pure functions get exhaustive unit tests; routes/components test behaviour, not
  re-test logic already proven in `lib`.
- External effects are mocked: Supabase (`@supabase/supabase-js`), `fetch`, and
  `alert` are stubbed per test. `clearMocks`/`restoreMocks` reset them automatically.
- Components that use timers (e.g. `ChatWidget`) drive Vitest fake timers; helpers
  in the spec advance them.
- Test files are excluded from the Next.js build via the root `tsconfig.json`;
  `tests/tsconfig.json` gives the specs their own (Vitest + jest-dom) types.
