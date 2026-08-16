// Small deterministic-ish helpers for natural-looking variation.
export const rand = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Build an array of `n` items from a factory.
export const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));
