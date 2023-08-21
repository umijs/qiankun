/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Note: sync with runner/src/types.ts
interface BenchmarkResponse {
  millis: number;
}

let startTime: number;
export function start() {
  startTime = performance.now();
}

export async function stop() {
  const end = performance.now();
  const runtime = end - startTime;
  console.log('benchmark runtime', runtime, 'ms');
  const response: BenchmarkResponse = {
    millis: runtime,
  };
  fetch('/submitResults', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  });
}
