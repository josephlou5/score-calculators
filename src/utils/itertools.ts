/** Yields each index and element in the given iterable. */
export function* enumerate<T>(values: Iterable<T>): Generator<[number, T]> {
  let i = 0;
  for (const value of values) {
    yield [i, value];
    i++;
  }
}

/** Yields mapped values for each element in the given iterable. */
export function* map<T1, T2>(
  values: Iterable<T1>,
  mapFunc: (value: T1, index: number) => T2
): Generator<T2> {
  for (const [i, value] of enumerate(values)) {
    yield mapFunc(value, i);
  }
}

/**
 * Yields parallel values from the given iterables. Stops after the shorter
 * iterable.
 */
export function* zip<T1, T2>(
  values1: Iterable<T1>,
  values2: Iterable<T2>
): Generator<[T1, T2]> {
  const it1 = values1[Symbol.iterator]();
  const it2 = values2[Symbol.iterator]();
  while (true) {
    const x1 = it1.next();
    const x2 = it2.next();
    if (x1.done || x2.done) return;
    yield [x1.value, x2.value];
  }
}

/** Returns the sum of the given iterable. */
export function sum(values: Iterable<number>): number {
  let total = 0;
  for (const value of values) {
    total += value;
  }
  return total;
}
