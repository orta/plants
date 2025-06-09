// Simple seeded random number generator using a Linear Congruential Generator (LCG)
// This ensures consistent random values for the same seed
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Generate next random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Generate random number between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Generate random integer between min and max (inclusive)
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  // Helper function similar to the existing wobble pattern
  wobble(value: number, amount: number = 1): number {
    return value + (this.next() - 0.5) * amount;
  }
}

// Create a seeded random generator from a string or number
export const createSeededRandom = (seed: string | number): SeededRandom => {
  if (typeof seed === 'string') {
    // Convert string to number using a simple hash
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return new SeededRandom(Math.abs(hash));
  }
  return new SeededRandom(seed);
};