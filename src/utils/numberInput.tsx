import { ChangeEvent, FormEvent, InputHTMLAttributes } from "react";

/** Props for the `NumberInput` component. */
export interface NumberInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  allowNegative?: boolean;
  onNumberInput?: (value: number) => void;
  onNumberChange?: (value: number) => void;
}

/** A number input component that only allows numbers composed of digits. */
export function NumberInput({
  allowNegative = true,
  onNumberInput,
  onNumberChange,
  onInput,
  onChange,
  ...props
}: NumberInputProps) {
  const extractIntOptions: ExtractIntOptions = { allowNegative };

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const value = extractInt(event.currentTarget.value, extractIntOptions);
    onNumberInput?.(value);
    onInput?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = extractInt(event.currentTarget.value, extractIntOptions);
    onNumberChange?.(value);
    onChange?.(event);
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]"
      onInput={handleInput}
      onChange={handleChange}
      {...props}
    />
  );
}

/** Options for `extractInt`. */
export interface ExtractIntOptions {
  allowNegative: boolean;
}

/** Extracts an integer from all the digits found in the given string. */
export function extractInt(
  str: string,
  options: Partial<ExtractIntOptions> = {}
): number {
  const opts = extractIntOptionsWithDefaults(options);
  let value = 0;
  let seenDigit = false;
  let negative = false;
  for (const c of str) {
    if (opts.allowNegative && !seenDigit && c === "-") {
      negative = true;
      continue;
    }
    const digit = parseInt(c);
    if (Number.isNaN(digit)) continue;
    seenDigit = true;
    value = 10 * value + digit;
  }
  if (negative) {
    value *= -1;
  }
  return value;
}

/**
 * Extracts a list of integers from consecutive digits found in the given
 * string.
 */
export function extractIntList(
  str: string,
  options: Partial<ExtractIntOptions> = {}
): number[] {
  const opts = extractIntOptionsWithDefaults(options);
  const values = [];
  let currValue = 0;
  let seenValue = false;
  let negative = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const digit = parseInt(c);
    if (Number.isNaN(digit)) {
      if (seenValue) {
        if (negative) {
          currValue *= -1;
        }
        values.push(currValue);
        currValue = 0;
        seenValue = false;
        negative = false;
      }
      continue;
    }
    if (opts.allowNegative && !seenValue && i > 0 && str[i - 1] === "-") {
      // There is a minus sign preceding the first digit being seen.
      negative = true;
    }
    seenValue = true;
    currValue = 10 * currValue + digit;
  }
  if (seenValue) {
    if (negative) {
      currValue *= -1;
    }
    values.push(currValue);
  }
  return values;
}

function extractIntOptionsWithDefaults(
  options: Partial<ExtractIntOptions>
): ExtractIntOptions {
  return {
    allowNegative: true,
    ...options,
  };
}
