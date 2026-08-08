# qiankun benchmark

This workspace measures cold micro-app loading from the instant an adapter invokes its mount path until the app's core element is paintable. It compares the locally built qiankun package with qiankun 2.10.16, native iframe, Wujie 2.1.0, MicroApp 1.0.0-rc.32, and Garfish 1.19.7. Playwright Library owns browser lifecycle only; timing and paint detection run inside the page.

## Commands

Run from the repository root:

```bash
# Unified entry: run every suite sequentially and print one aggregated
# console report (tachometer-style tables) at the end.
pnpm bench                       # standard profile: 1 trial × 50 samples, A/A gate on (~20-30 min)
pnpm bench --profile=check       # plumbing only: 5 samples, performance gates off (~2 min)
pnpm bench --profile=full        # formal profile: 3 trials × 100 samples (hours)
pnpm bench --suites=core,ssr-streaming   # limit the suite list
pnpm bench --samples=30 --seed=42        # any other flag is forwarded to runner.mjs

# Fast plumbing checks: one browser trial and five samples per cell.
pnpm benchmark:check
pnpm benchmark:ecosystem:check
pnpm benchmark:ssr-streaming:check

# Formal runs: three independent browser trials, each with five warmups,
# 100 samples per product cell, and 100 samples per A/A arm.
pnpm benchmark:smoke
pnpm benchmark:ecosystem
pnpm benchmark:site-isolation
pnpm benchmark:ssr-streaming

# PR-CI-sized performance floor: three independent browser trials,
# 100 samples per cell, and enforced A/A plus suite comparison gates.
pnpm benchmark:ci-basic

# RFC hard metric 2: baseline/candidate membrane, rewrite, and load-chain gate.
pnpm benchmark:rfc-performance
```

The check commands disable the A/A and suite comparison gates and are not performance evidence. Formal run results are written to `benchmark/results/<timestamp>-<commit>/`; raw warmups and measurements are retained.

To compare two repeated runs by absolute median, use the guarded comparison command:

```bash
pnpm --filter @qiankunjs/benchmark run compare:results -- \
  benchmark/results/<reference> benchmark/results/<candidate>
```

This command rejects results whose harness fingerprints differ. The fingerprint covers the environment, Chromium and Playwright versions, launch/context options, suite definition, sampling configuration, selected adapter configuration and versions, selected Vite entry graph, fixture behavior, and timing/statistics source. Cross-run medians remain diagnostic; the paired comparisons inside one run are the primary result.

Install the pinned Chromium revision once if Playwright reports that it is missing:

```bash
pnpm --filter @qiankunjs/benchmark exec playwright install chromium
```

## Suites

Suites are explicit and independent; adding an ecosystem framework does not alter the frozen core schedule.

| Suite | Cells | Purpose |
| --- | --: | --- |
| `core` | 8 | qiankun isolation cost plus buffered and streamed comparisons with native iframe and Wujie |
| `ci-basic` | 5 | CI-only floor for the buffered sandbox path and progressive SSR streaming |
| `site-isolation` | 6 | same-site anchors and cross-site entries for qiankun, native iframe, and Wujie |
| `ecosystem-html` | 6 | one canonical same-site, buffered, isolated cell for each framework/version |
| `ssr-streaming` | 6 | literal SSR progressive reveal compared with an identical delayed buffer, native iframe, qiankun v2, Wujie, and Garfish |

The core suite contains qiankun with no isolation, sandbox only, and sandbox plus style isolation; same-site buffered native iframe and Wujie; and streamed native iframe, qiankun, and Wujie cells.

The CI-only basic suite reuses five canonical cells: buffered qiankun without isolation, buffered qiankun with its default sandbox, a buffered native iframe, and the identical-byte qiankun v3 SSR fixture under delayed-buffered and streamed delivery. It is excluded from the unified `pnpm bench` suite list because those cells already belong to the formal core and SSR suites.

The ecosystem suite intentionally adds only these canonical cells:

- native iframe;
- qiankun 2.10.16 with its Proxy sandbox and experimental scoped CSS isolation;
- the locally built qiankun with sandbox and style isolation;
- Wujie with its intrinsic iframe and Shadow DOM isolation;
- MicroApp with its default sandbox and scoped CSS;
- Garfish with Browser VM sandbox, effect collection enabled (`cache: false`), and strict Shadow DOM isolation.

The ecosystem suite stays intentionally small and does not duplicate its canonical cells under streamed delivery. Native HTML parsing and the locally built qiankun can render progressively; qiankun 2.10.16, Wujie, MicroApp, and Garfish accept chunked responses but currently consume the complete HTML before parsing. The core suite retains Wujie's streamed-response diagnostic because Wujie is qiankun's phase-one comparison target. Framework isolation semantics are also not identical: qiankun v2 uses selector rewriting, the local qiankun uses CSS `@scope`, and Garfish/Wujie use Shadow DOM. The suite compares observed user-visible latency under these isolated configurations, not security equivalence.

The dedicated SSR suite is the canonical streaming comparison. Unlike the core suite's client-rendered chunk diagnostic, its response contains literal server-rendered markup: the first chunk includes the stylesheet, critical element, 12 visible rows, and native paint reporter; the second adds 44 deferred rows; and the final chunk adds another 44 rows, the stream-tail marker, serialized SSR data, the only external lifecycle entry script, and the closing tags. The default schedule is 0/50/100 ms. Keeping the entry script last lets progressive consumers reveal the SSR core while framework settlement and cleanup still wait for the complete response and lifecycle execution. An identical-byte qiankun v3 control withholds the complete response until 100 ms, isolating progressive reveal from fixture content and response-tail duration. Native iframe and qiankun v3 can expose the critical markup before EOF; the pinned qiankun v2, Wujie, and Garfish adapters currently buffer the complete HTML response first.

This is a deterministic SSR-shaped fixture, not a React/Vue server-rendering or hydration throughput benchmark. Its entry script supplies framework lifecycles and marks the already rendered core as mounted. The streamed-versus-delayed result therefore represents earlier CSS discovery, progressive DOM insertion, and hiding response-tail latency; it must not be interpreted as pure parser, sandbox, or loader CPU throughput.

The cross-site suite uses identical response bytes for all products. Native iframe must create an OOPIF under Chromium's `--site-per-process`; a separate preflight browser verifies that condition. Wujie 2.1.0 fetches its cross-site entry while retaining a host-origin `srcdoc` JavaScript realm, so that cell is described as a cross-site entry rather than a cross-site iframe.

## Measurement contract

- `t0`: immediately before the selected adapter invokes `loadMicroApp`, `startApp`, `renderApp`, native iframe navigation, or `Garfish.loadApp`.
- `t1`: the core marker has non-zero geometry, contains `[data-benchmark-critical]`, is visible, has the expected CSS sentinel, and survives two `requestAnimationFrame` callbacks. It does not require `data-mounted=true`, so visible SSR content can finish this metric before client lifecycle settlement.
- Framework settlement and cleanup must succeed, but both remain outside the measured duration.
- After settlement, the harness separately requires `data-mounted=true`; a framework cannot pass by exposing SSR markup without completing its lifecycle.
- Every attempt gets a fresh BrowserContext and page. Every formal trial gets a newly launched Chromium process.
- Adapter module initialization happens before `t0` and may not request fixture resources; the runner fails the sample if it observes such a request.
- Native iframe reports its child-document paint timestamp through an origin-, source-, version-, and token-validated `postMessage`.
- Buffered and streamed responses contain identical bytes. Streamed HTML is emitted at 0/50/100 ms by default.
- The SSR delayed-buffer control contains the same bytes as its streamed counterpart and sends them together at the time the stream would have ended.
- HTML responses are `no-store`; deterministic static assets are immutable so qiankun's walk-ahead preload can satisfy its subsequent sandbox fetch. Fresh BrowserContexts keep every measured sample cold.
- No trace, video, screenshot, HAR, route interception, retry, outlier replacement, or parallel execution is enabled.
- Host bundle download and top-level framework initialization are outside this benchmark's scope.

The primary metric remains `t1 - t0`. Reports also retain framework-settlement time (`settled - t0`) and the entry HTML resource's response-end time (`PerformanceResourceTiming.responseEnd - t0`) as diagnostics; response end does not represent the entire static-resource waterfall. `response end - core paint` is reported as paint lead: a positive value means this harness observed the user-visible core before the complete HTML response arrived. Native iframe navigation timing is not visible as a parent-page resource entry, so its response-end and paint-lead diagnostics are `n/a`; its child-reported primary paint duration remains valid. These per-variant medians explain the result but do not replace the primary metric or participate in paired comparisons, confidence intervals, or pass/fail gates.

Rounds are paired within each independent browser trial. The primary estimate is the median of per-trial median log ratios. Its 95% confidence interval comes from a hierarchical 10,000-resample bootstrap that resamples trials first and rounds second, so a `3 × 100` run is not treated as 300 independent observations. Median, mean, p75, p95, MAD, standard deviation, CV, and each trial's summary are also retained. Positive deltas mean the candidate is slower than the reference.

## A/A calibration

Each trial first interleaves two aliases of the exact same selected qiankun cell. This A/A run checks whether the harness can correctly report no difference when there is no implementation difference; it is not a product or revision comparison. The SSR suite uses its streamed qiankun v3 cell, the CI basic suite uses its sandbox cell, and the other suites use the canonical fully isolated cell. The gate judges the trial-aggregated evaluation, which must satisfy:

- absolute paired median delta no greater than 3%;
- the bootstrap 95% interval includes 0%;
- interval width no greater than 10 percentage points.

Per-trial A/A results are reported as diagnostics only: requiring every independent trial's interval to contain zero would compound the false-rejection rate as trials are added, while the hierarchical bootstrap already weighs each trial in the aggregate judgment.

## Basic CI performance gate

Hosted-runner noise has two layers, and the gate accounts for both. Browser-session state drifts between trials on one machine, which multiple independent trials absorb. Machines themselves additionally bias the sandbox-versus-native comparison by several percentage points — the two architectures stress different browser subsystems, so VM differences do not cancel in that ratio the way they do for qiankun-versus-qiankun cells. The CI workflow therefore runs **six shards on independent runner VMs, each with two browser trials and its own seed**, and a final job pools every shard's raw samples (`aggregate-shards.mjs`): shard trials are re-tagged into globally unique trial ids and judged by the same hierarchical bootstrap, so between-VM variance is part of the reported intervals. The local `pnpm benchmark:ci-basic` profile runs three trials on one machine and cannot capture the between-VM layer.

Each trial uses five warmups, 100 paired samples per product cell, and 100 samples per A/A arm. Every sample must still satisfy the complete measurement contract, including visible styled content, lifecycle settlement, error-free loading, and cleanup. The aggregated paired-bootstrap 95% confidence-interval upper bounds must satisfy:

- sandbox versus no isolation: no greater than `+10%` and no greater than `+5ms` absolute — this is the sandbox-overhead budget proper;
- sandbox versus native iframe: no greater than `+15%` and no greater than `+10ms` absolute — an end-to-end cold-paint floor across two architectures (fetch-driven streaming versus native iframe navigation with its preload scanner), not pure sandbox overhead: cross-VM measurement puts the floor at roughly `+2%` to `+9%` depending on the runner fleet mix with upper bounds up to `~+11.6%`, so `+15%` guards the architecture gap from regressing while remaining stably satisfiable;
- streamed versus delayed-buffered SSR: no greater than `-30%`, proving the progressive path is at least 30% faster with 95% confidence.

The percentage and absolute bounds guard different failure modes. A percentage detects proportional regressions but, on a small fixture, disguises fixed constant costs as percentages (and would dilute them into invisibility on a large one); the absolute paired-delta bound targets the constant directly — the measured fixed cost is roughly `+1ms` for the sandbox layer and `+2-3ms` for the whole pipeline versus the native iframe. Absolute milliseconds are machine-speed dependent: these budgets are calibrated for GitHub `ubuntu-24.04` hosted runners and this fixture, and sized as disaster guards (an accidental extra round-trip or synchronous stall exceeds them immediately).

These are regression floors, not optimization targets. Both basic overhead comparisons are capped at 10%. Relative, within-run comparisons avoid absolute millisecond thresholds that would vary with CI runner hardware. The suite comparison gate can be disabled with `--comparison-gate=false` for plumbing diagnostics, but such a run is not performance evidence.

## Revision comparison

To validate a qiankun optimization, snapshot the fully bundled host from a clean baseline revision, then run an interleaved candidate comparison:

```bash
# On the clean baseline revision. Existing snapshots are never overwritten.
pnpm benchmark:baseline

# After making and building the candidate change.
pnpm benchmark:compare

# Five paired samples for plumbing only; the improvement gate is disabled.
pnpm benchmark:compare:check
```

The snapshot contains the complete Vite host bundle, preventing baseline and candidate package graphs from mixing. It also records a revision-harness compatibility hash that excludes qiankun package sources but covers the adapter, fixture, timing contract, runner, statistics, browser options, and toolchain inputs. The runner rejects stale snapshots when any of those inputs change; recreate old schema snapshots before running a revision comparison.

Revision mode remains a single browser trial with balanced baseline/candidate rounds and fresh BrowserContexts; it passes only when every sample is valid and the paired-bootstrap 95% confidence interval is entirely below 0%. Use `--scenario=sandbox` with a named snapshot to isolate the buffered sandbox-only path.

## RFC hard metric 2 acceptance

The revision benchmark added in #3148 covers the complete buffered sandbox load chain through `--scenario=sandbox`. It does not time membrane property traps or ESM source rewriting independently, so the load result alone cannot satisfy the RFC's three-part performance criterion.

`pnpm benchmark:rfc-performance` closes those two gaps while retaining the existing load-chain measurement:

| Metric | Timed work | Reported value |
| --- | --- | --: |
| membrane get | repeated reads through a `Membrane` proxy view | Mops/s |
| membrane set | repeated writes through the same membrane view | Mops/s |
| ESM module rewrite | lexer, global scan, specifier edits, and source assembly for a deterministic module corpus | MiB/s |
| sandbox load chain | the existing cold buffered `loadMicroApp` path from mount invocation to stable paint | ms |

The browser micro-probes report batch time per operation; throughput is its inverse. Baseline and candidate cells are interleaved in the same Chromium process, while load-chain cells retain a fresh BrowserContext and page per attempt. Every comparison uses paired log ratios and retains the existing 10,000-resample bootstrap confidence interval as uncertainty evidence. A metric passes only when its paired median latency regression is at most **+5%** relative to baseline **and** the bootstrap 95% confidence interval is narrower than **10pp** — a wider interval fails the metric as inconclusive rather than letting a noisy run pass on its point estimate. This is deliberately different from the optimization-only revision gate, which requires the whole interval to be below 0%.

The baseline snapshot and candidate must use the same benchmark harness. The snapshot contains both the normal qiankun host and the RFC micro-probe bundle, so package implementations cannot mix across revisions. Formal results are written to `benchmark/results/<timestamp>-<commit>-rfc-hard-metric-2/` as:

- `result.json`: metadata, snapshot and harness fingerprints, raw warmups/product samples, bootstrap comparisons, and per-metric gate evaluations;
- `summary.md`: the four metric medians, paired deltas, confidence intervals, and pass/fail decisions.

Local snapshots are written to `benchmark/artifacts/`, and benchmark results are written to `benchmark/results/`; both are gitignored. The full framework suites, revision comparisons, and RFC hard-metric benchmark remain manual performance evidence, while `ci-basic` is sized for regular PR CI.
