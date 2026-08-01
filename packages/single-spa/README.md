# @qiankunjs/single-spa

qiankun's vendored fork of [single-spa](https://github.com/single-spa/single-spa), consumed by the `qiankun` package as its application/parcel lifecycle router. See the vendoring RFC in [umijs/qiankun#3168](https://github.com/umijs/qiankun/issues/3168) for the full rationale and plan.

## Fork baseline

- Upstream: `single-spa/single-spa`, `7.0` branch @ [`ce0f925a`](https://github.com/single-spa/single-spa/commit/ce0f925a40a81809c598de21b36ad79706222a73) (tag `v7.0.0-beta.13`, 2025-09-22).
- Imported verbatim (`src/`, `spec/`, `node-spec/`, `LICENSE`), then naturalized to this monorepo's toolchain (Vite 8 build, `tsc` declarations, vitest). Upstream rollup/babel/jest configs were not carried over; the compile-time constants they injected (`__DEV__`, `__PROFILE__`, `process.env.BABEL_ENV`) are provided by `vite.library.config.ts` (build) and the root `vitest.config.ts` (tests).
- The profile variant entry (`src/single-spa.profile.ts` + `src/devtools/profiler-api.ts`) is kept in the tree but not built or published yet; `__PROFILE__` is compiled to `false`.
- Versioning is independent of upstream beta numbering and follows this monorepo's changesets flow.

## Behavioral divergences from upstream

Maintained deliberately; this list is the contract (keep it in sync when adding divergences):

1. **The upstream `bootstrap` → `init` rename ([single-spa#1307](https://github.com/single-spa/single-spa/pull/1307), completed by [#1333](https://github.com/single-spa/single-spa/pull/1333)) is reverted wholesale — v6 naming is canonical.** qiankun's ecosystem was built on the bootstrap vocabulary and there was no reason to break it. Concretely:
   - the `bootstrap` lifecycle is the canonical name for applications and parcels (`init` stays accepted as an alias; `bootstrap` wins when both are present);
   - `parcel.bootstrapPromise` is the canonical parcel promise (`initPromise` stays as an alias, always the same promise instance);
   - `setBootstrapMaxTime` is the canonical timeout API (`setInitMaxTime` stays as an alias export), and the `timeouts.bootstrap` key is canonical (`timeouts.init` accepted as an alias);
   - the `NOT_BOOTSTRAPPED` / `BOOTSTRAPPING` statuses are restored, both as `AppOrParcelStatus` member names and as the raw `getStatus()` string values (v7's `NOT_INITIALIZED` / `INITIALIZING` strings do not exist in this fork — a status is a value, not an API, so it has exactly one spelling);
   - error message texts use the bootstrap vocabulary again.

   The v7 `init` names are permanent compatibility aliases, not deprecations. The upstream specs that exercise the `init` spelling are kept as the alias-path coverage; `spec/apps/bootstrap-prioritized-over-init/` (inverted from upstream's `init-prioritized-over-bootstrap`), `spec/apps/legacy-bootstrap/` and `spec/parcels/bootstrap-promise-alias.spec.ts` cover the canonical path.

## Invariant contracts (never break)

- All `single-spa:*` window events (`single-spa:before-routing-event`, `single-spa:routing-event`, `single-spa:no-app-change`, `single-spa:first-mount`, …) — qiankun and the wider ecosystem listen to them.
- The `window.__SINGLE_SPA_DEVTOOLS__` hook (single-spa-inspector support).
- Public API and type signatures stay 1:1 with the upstream baseline during phase one, except for the bootstrap-naming revert above — qiankun-observable behavior stays 1:1 with what its ecosystem shipped against, which is the higher-priority contract.
- Zero runtime dependencies; this package sits at the bottom of the workspace dependency graph and must not import `@qiankunjs/shared`, `@qiankunjs/sandbox` or `@qiankunjs/loader`.

## Known semantics now owned by this fork

- `urlRerouteOnly` (documented at length in qiankun's `docs/api/start.md`) — qiankun passes it through untouched; the implementation and its semantics live here now.
- **Single-instance assumption**: single-spa is a stateful routing singleton. Loading both the ESM and CJS builds in one page (or mixing this fork with a separately installed npm `single-spa`) silently creates two independent routers — two history patches, two event streams, two `started` flags. Don't.

## Upstream sync

Expected cadence ≈ zero (upstream is dormant). If a fix is worth absorbing:

```bash
git remote add single-spa-upstream https://github.com/single-spa/single-spa.git
git fetch single-spa-upstream 7.0
git log ce0f925a..single-spa-upstream/7.0 --oneline   # review the delta
# apply selected commits manually onto packages/single-spa/src/ (path prefixes differ)
```

Update the baseline note above after absorbing anything; on conflict with the divergence list, the divergence list wins.

## License

MIT — upstream's [LICENSE](./LICENSE) is preserved.
