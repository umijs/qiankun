/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as systeminformation from 'systeminformation';

import {BrowserConfig} from './browser';
import {measurementName} from './measure';
import {ResultStatsWithDifferences} from './stats';
import {BenchmarkResult, Measurement} from './types';

export interface JsonOutputFile {
  benchmarks: Benchmark[];
}

interface BrowserConfigResult extends BrowserConfig {
  userAgent?: string;
}

interface Benchmark {
  name: string;
  bytesSent: number;
  version?: string;
  measurement: Measurement;
  browser?: BrowserConfigResult;
  mean: ConfidenceInterval;
  differences: Array<Difference | null>;
  samples: number[];
}

interface Difference {
  absolute: ConfidenceInterval;
  percentChange: ConfidenceInterval;
}

interface ConfidenceInterval {
  low: number;
  high: number;
}

export function jsonOutput(
  results: ResultStatsWithDifferences[]
): JsonOutputFile {
  const benchmarks: Benchmark[] = [];
  for (const result of results) {
    const differences: Array<Difference | null> = [];
    for (const difference of result.differences) {
      if (difference === null) {
        differences.push(null);
      } else {
        differences.push({
          absolute: {
            low: difference.absolute.low,
            high: difference.absolute.high,
          },
          percentChange: {
            low: difference.relative.low * 100,
            high: difference.relative.high * 100,
          },
        });
      }
    }
    benchmarks.push({
      name: result.result.name,
      bytesSent: result.result.bytesSent,
      version: result.result.version ? result.result.version : undefined,
      measurement: {
        name: measurementName(result.result.measurement),
        ...result.result.measurement,
      },
      browser: {
        ...result.result.browser,
        userAgent: result.result.userAgent,
      },
      mean: {
        low: result.stats.meanCI.low,
        high: result.stats.meanCI.high,
      },
      differences,
      samples: result.result.millis,
    });
  }
  return {benchmarks};
}

// TODO(aomarks) Remove this in next major version.
export interface LegacyJsonOutputFormat {
  benchmarks: BenchmarkResult[];
  datetime: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  system: {
    cpu: {
      manufacturer: string;
      model: string;
      family: string;
      speed: string;
      cores: number;
    };
    load: {
      average: number;
      current: number;
    };
    battery: {
      hasBattery: boolean;
      connected: boolean;
    };
    memory: {
      total: number;
      free: number;
      used: number;
      active: number;
      available: number;
    };
  };
}

// TODO(aomarks) Remove this in next major version.
export async function legacyJsonOutput(
  results: BenchmarkResult[]
): Promise<LegacyJsonOutputFormat> {
  // TODO Add git info.
  const battery = await systeminformation.battery();
  const cpu = await systeminformation.cpu();
  const currentLoad = await systeminformation.currentLoad();
  const memory = await systeminformation.mem();
  return {
    benchmarks: results,
    datetime: new Date().toISOString(),
    system: {
      cpu: {
        manufacturer: cpu.manufacturer,
        model: cpu.model,
        family: cpu.family,
        speed: cpu.speed.toFixed(2),
        cores: cpu.cores,
      },
      load: {
        average: currentLoad.avgLoad,
        current: currentLoad.currentLoad,
      },
      battery: {
        hasBattery: battery.hasBattery,
        connected: battery.acConnected,
      },
      memory: {
        total: memory.total,
        free: memory.free,
        used: memory.used,
        active: memory.active,
        available: memory.available,
      },
    },
  };
}
