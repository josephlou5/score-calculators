/**
 * Returns a `className` string with the given classes.
 *
 * If a mapping is given, the boolean value represents whether to include the
 * class.
 */
export function makeClassName(
  classNames: string[] | { [key: string]: boolean }
): string | undefined {
  if (Array.isArray(classNames)) {
    return classNames.join(" ") || undefined;
  }
  return (
    Object.entries(classNames)
      .flatMap(([className, include]) => (include ? [className] : []))
      .join(" ") || undefined
  );
}
