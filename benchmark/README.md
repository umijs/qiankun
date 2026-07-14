# qiankun benchmark

This workspace compares the cold-load path of the locally built qiankun package with a pinned Wujie release. It is intentionally separate from `e2e/`: Playwright Library only drives the browser boundaries, while all timing and core-element detection run inside the page.

## Commands

Run from the repository root:

```bash
# Five samples per product cell. Validates plumbing only; not performance data.
pnpm benchmark:check

# Five warmups, 100 valid attempts per product cell, and 50 samples per A/A arm.
pnpm benchmark:smoke
```

To compare a performance change against an interleaved baseline, snapshot the fully bundled host before editing package code, then run the comparison after the change:

```bash
# On the clean baseline revision. Fails instead of overwriting an existing snapshot.
pnpm benchmark:baseline

# After making and building the candidate change. Runs 100 paired samples per revision.
pnpm benchmark:compare

# Five paired samples for plumbing only; the improvement gate is disabled.
pnpm benchmark:compare:check
```

The baseline snapshot contains the complete Vite host bundle, so its qiankun, loader, sandbox, and shared dependency graph cannot mix with candidate packages. Revision samples use different host origins, fresh BrowserContexts, a balanced alternating order, and the same streamed fixture. A formal comparison passes only when every sample is valid and the paired bootstrap 95% confidence interval is entirely below 0%.

Install the pinned Chromium revision once if Playwright reports that it is missing:

```bash
pnpm --filter @qiankunjs/benchmark exec playwright install chromium
```

Local snapshots are written to `benchmark/artifacts/`; run results are written to `benchmark/results/<timestamp>-<commit>/`. Both are gitignored.

## Matrix

The matrix is explicit rather than a cartesian product:

1. qiankun without sandbox or style isolation
2. qiankun with sandbox only
3. qiankun with sandbox and style isolation
4. Wujie with its intrinsic iframe and Shadow DOM isolation
5. qiankun with full isolation and a three-chunk HTML response
6. Wujie with the same three-chunk HTML response

Wujie does not expose switches that disable its JavaScript or CSS isolation. Its off-cases are therefore marked N/A instead of being compared against a semantically different configuration.

## Measurement contract

- `t0`: immediately before `loadMicroApp` or `startApp` is called in the host page.
- `t1`: the core marker exists, has non-zero geometry, is visible, has the expected CSS sentinel, and survives two `requestAnimationFrame` callbacks.
- The framework must still finish mounting successfully; settlement is awaited outside the measured duration.
- Buffered and streamed entry responses contain identical bytes. Streamed HTML is emitted at 0/50/100 ms by default.
- The browser process is reused, but every attempt receives a fresh BrowserContext and page.
- No trace, video, screenshot, HAR, route interception, retry, or parallel execution is enabled.
- Raw warmup and measured samples are retained; none are silently replaced or filtered as outliers.

The primary statistic is the paired median relative delta with a 10,000-resample bootstrap 95% confidence interval. Median, mean, p75, p95, MAD, standard deviation, and CV are also retained. Positive comparison deltas mean the candidate is slower than the reference.

## A/A calibration

Before the product matrix, two aliases of the exact same fully isolated qiankun variant are interleaved. The formal run requires:

- absolute paired median delta no greater than 3%;
- the bootstrap 95% interval includes 0%;
- interval width no greater than 10 percentage points.

The benchmark is manual in phase one and is not part of the regular PR CI gate.
