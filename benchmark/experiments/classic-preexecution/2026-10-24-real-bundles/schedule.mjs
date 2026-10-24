function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(values, seed) {
  const result = [...values];
  const random = createSeededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createBalancedSchedule(variants, rounds, seed) {
  if (variants.length === 0) throw new Error('at least one variant is required');
  if (new Set(variants).size !== variants.length) throw new Error('variant ids must be unique');
  if (!Number.isInteger(rounds) || rounds <= 0) throw new Error('rounds must be a positive integer');

  const base = shuffle(variants, seed);
  const schedule = [];

  for (let round = 0; round < rounds; round += 1) {
    const block = Math.floor(round / base.length);
    const blockOrder = block % 2 === 0 ? base : [...base].reverse();
    const offset = round % base.length;
    const order = [...blockOrder.slice(offset), ...blockOrder.slice(0, offset)];
    order.forEach((variant, position) => schedule.push({ position, round, variant }));
  }

  return schedule;
}
