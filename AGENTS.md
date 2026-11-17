# runlark-theme Contributor Guide

Runlark appearance theme (`@dev-platform/runlark-theme`) adding the Runlark (ink, paper, gold) palette to `Settings -> General -> Appearance`. See [README.md](README.md), [PROVENANCE.md](PROVENANCE.md), [VERIFICATION.md](VERIFICATION.md), and [../AGENTS.md](../AGENTS.md).

## Layout

- `src/index.ts`, `src/settings.ts`, `src/client/` (`theme.machine.ts` `themeLayer` XState machine, `AppearanceThemeRow.tsx`, `theme-layer.ts`, `tokens.ts`, `locales.ts`).
- `data/runlark-ui-tokens.json`: canonical theme tokens.
- `scripts/build.ts`, `tsdown.config.ts`: emits committed `lib/index.js`, `lib/client.js`, `lib/client.graph.json`.
- `locale/`: `en.json`, `ru.json`.
- `src/__tests__/`, `src/client/__tests__/`, `scripts/__tests__/release-package.test.ts`.

## Invariants

- **Confirmed state only:** Keep the theme layer on the last confirmed Host value; never apply an unconfirmed selection if Host saving fails.
- **Committed `lib/`:** Commit `lib/` artifacts after every change (`node scripts/build.ts`). Note `vitest run` is configured via `vitest.config.ts`.

## Verification

```sh
npm ci
npm run typecheck
npm run build     # node scripts/build.ts
npx vitest run
```

Sync `../machines` if `src/client/theme.machine.ts` changes, and update `../repositories.json` snapshot metadata when files here change.
