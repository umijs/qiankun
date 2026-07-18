# qiankun benchmark

This workspace measures cold micro-app loading from the instant an adapter invokes its mount path until the app's core element is paintable. It compares the locally built qiankun package with qiankun 2.10.16, native iframe, Wujie 2.1.0, MicroApp 1.0.0-rc.32, and Garfish 1.19.7. Playwright Library owns browser lifecycle only; timing and paint detection run inside the page.

## Commands

Run from the repository root:

```bash
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
```

The check commands disable the A/A gate and are not performance evidence. Formal run results are written to `benchmark/results/<timestamp>-<commit>/`; raw warmups and measurements are retained.

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
| `site-isolation` | 6 | same-site anchors and cross-site entries for qiankun, native iframe, and Wujie |
| `ecosystem-html` | 6 | one canonical same-site, buffered, isolated cell for each framework/version |
| `ssr-streaming` | 6 | literal SSR progressive reveal compared with an identical delayed buffer, native iframe, qiankun v2, Wujie, and Garfish |

The core suite contains qiankun with no isolation, sandbox only, and sandbox plus style isolation; same-site buffered native iframe and Wujie; and streamed native iframe, qiankun, and Wujie cells.

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

Each trial first interleaves two aliases of the exact same selected qiankun cell. The SSR suite uses its streamed qiankun v3 cell; the other suites use the canonical fully isolated cell. Both every trial and the aggregate must satisfy:

- absolute paired median delta no greater than 3%;
- the bootstrap 95% interval includes 0%;
- interval width no greater than 10 percentage points.

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

Local snapshots are written to `benchmark/artifacts/`. Snapshots and results are gitignored, and the benchmark remains a manual gate rather than part of regular PR CI.
