// Deterministic PRNG (Mulberry32)
export function createRng(seed: number) {
  let t = seed >>> 0;
  return function next(): number {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndexWeighted(weights: number[], rnd: () => number): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const target = rnd() * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (target <= acc) return i;
  }
  return weights.length - 1;
}


