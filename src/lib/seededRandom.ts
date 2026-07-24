export type SeededPoint = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x100000000;
  };
}

export function createSeededPoints(count: number, seed: number): SeededPoint[] {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: random() * 100,
    y: random() * 100,
    size: 1 + random() * 2.8,
    delay: random() * 8,
    duration: 9 + random() * 12,
    opacity: 0.35 + random() * 0.65,
  }));
}
