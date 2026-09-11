# micro-frontend HTML-entry benchmark

- Run: 2026-09-11T16-23-16-039Z-187287e8
- Commit: 187287e86d548ee3da9c0f123c9cd7b5b0b230db (dirty)
- Chromium: 149.0.7827.55
- Suite: core
- Independent browser trials: 3
- Samples: 100 per product cell per trial
- Warmup: 5 per cell per trial
- Seed: 20260711
- Frameworks: qiankun@3.0.0-rc.22, native@browser-iframe, wujie@2.1.0
- Harness fingerprint: 7f474244fb4d68c05b66ac8a159d583dd1cf8af7bea5634a51919df6041d4a06

> Positive comparison deltas mean the candidate is slower than the reference. Comparisons pair rounds within each browser trial, then aggregate trials with equal weight.

## A/A calibration

### Variants

| Variant | Valid | Invalid | Median (ms) | p95 (ms) | MAD (ms) |
| ------- | ----: | ------: | ----------: | -------: | -------: |
| A/A · A |   300 |       0 |       43.50 |    54.20 |     1.60 |
| A/A · B |   300 |       0 |       43.85 |    54.11 |     1.85 |

### Phase diagnostics

> Paint lead is HTML response end minus core paint; positive values prove the core painted before the full response completed.

| Variant | Mount settled median (ms) | HTML response end median (ms) | Paint lead median (ms) |
| ------- | ------------------------: | ----------------------------: | ---------------------: |
| A/A · A |                      6.80 |                          2.40 |                 -41.20 |
| A/A · B |                      6.95 |                          2.40 |                 -41.50 |

### Comparisons

| Comparison | Relative delta | 95% CI | Absolute delta | Absolute 95% CI | Trials | Paired samples |
| --- | --: | --: | --: | --: | --: | --: |
| A/A identical qiankun variants | +0.24% | -1.45% to +1.25% | +0.10ms | -0.70ms to +0.60ms | 3 | 300 |

Calibration diagnostic: **passed** Calibration gate: **enforced**

## Core HTML-entry matrix

### Variants

| Variant                              | Valid | Invalid | Median (ms) | p95 (ms) | MAD (ms) |
| ------------------------------------ | ----: | ------: | ----------: | -------: | -------: |
| qiankun · no isolation               |   300 |       0 |       43.60 |    53.80 |     4.00 |
| qiankun · sandbox                    |   300 |       0 |       43.35 |    54.31 |     2.40 |
| qiankun · sandbox + style isolation  |   300 |       0 |       44.15 |    54.00 |     3.25 |
| Native iframe · same-site · buffered |   300 |       0 |       46.10 |    52.40 |     2.40 |
| Wujie · same-site entry              |   300 |       0 |       59.10 |    64.91 |     2.40 |
| Native iframe · same-site · streamed |   300 |       0 |       96.50 |    99.10 |     1.50 |
| qiankun · streamed                   |   300 |       0 |       93.00 |   102.10 |     1.75 |
| Wujie · streamed response            |   300 |       0 |      144.80 |   156.90 |     2.15 |

### Phase diagnostics

> Paint lead is HTML response end minus core paint; positive values prove the core painted before the full response completed.

| Variant | Mount settled median (ms) | HTML response end median (ms) | Paint lead median (ms) |
| --- | --: | --: | --: |
| qiankun · no isolation | 4.90 | 1.70 | -41.90 |
| qiankun · sandbox | 6.90 | 2.40 | -41.00 |
| qiankun · sandbox + style isolation | 7.00 | 2.40 | -41.80 |
| Native iframe · same-site · buffered | 4.30 | n/a | n/a |
| Wujie · same-site entry | 17.25 | 3.20 | -55.80 |
| Native iframe · same-site · streamed | 103.50 | n/a | n/a |
| qiankun · streamed | 106.30 | 103.30 | 10.45 |
| Wujie · streamed response | 109.40 | 104.10 | -40.80 |

### Comparisons

| Comparison | Relative delta | 95% CI | Absolute delta | Absolute 95% CI | Trials | Paired samples |
| --- | --: | --: | --: | --: | --: | --: |
| qiankun sandbox cost | +0.00% | -2.50% to +1.70% | +0.00ms | -1.10ms to +0.70ms | 3 | 300 |
| qiankun style isolation cost | +3.09% | -0.74% to +6.52% | +1.50ms | -0.30ms to +2.70ms | 3 | 300 |
| qiankun vs native iframe under same-site isolation | -0.30% | -6.57% to +3.99% | -0.15ms | -3.05ms to +2.00ms | 3 | 300 |
| Wujie vs native iframe with same-site entries | +28.45% | +24.45% to +32.55% | +12.70ms | +11.35ms to +14.70ms | 3 | 300 |
| Wujie vs qiankun with same-site entries | +32.32% | +23.47% to +36.91% | +13.95ms | +10.50ms to +16.10ms | 3 | 300 |
| qiankun vs native iframe with streamed HTML | -4.07% | -4.48% to -3.48% | -3.95ms | -4.40ms to -3.35ms | 3 | 300 |
| Wujie vs native iframe with streamed HTML | +49.24% | +48.54% to +53.44% | +47.50ms | +47.20ms to +51.05ms | 3 | 300 |
| Wujie vs qiankun with streamed HTML | +55.32% | +54.59% to +59.21% | +51.80ms | +51.05ms to +54.20ms | 3 | 300 |
