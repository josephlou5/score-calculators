/**
 * Returns a count with a singular or plural label depending on whether the
 * count is more than 1.
 */
export function countLabel(
  count: number,
  label: string,
  plural: string | null = null
) {
  plural ??= `${label}s`;
  return `${count} ${count > 1 ? plural : label}`;
}
