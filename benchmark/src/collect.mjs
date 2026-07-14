import { createBalancedSchedule } from './schedule.mjs';

export async function collectSamples({ rounds, sample, seed, variants }) {
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
  const sampleSchedule = createBalancedSchedule(
    variants.map((variant) => variant.id),
    rounds,
    seed,
  );
  const samples = [];

  for (const entry of sampleSchedule) {
    const sequence = samples.length;
    const variant = variantsById.get(entry.variant);
    try {
      const measurement = await sample(variant, entry);
      samples.push({
        ...measurement,
        position: entry.position,
        round: entry.round,
        sequence,
        valid: true,
        variant: entry.variant,
      });
    } catch (error) {
      samples.push({
        error: error instanceof Error ? error.message : String(error),
        position: entry.position,
        round: entry.round,
        sequence,
        valid: false,
        variant: entry.variant,
      });
    }
  }

  return samples;
}
