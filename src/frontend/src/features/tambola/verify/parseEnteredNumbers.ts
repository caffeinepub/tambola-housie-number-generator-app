/**
 * Parse a comma/space-separated string into an array of unique integers.
 * Ignores empty tokens and non-numeric values.
 */
export function parseEnteredNumbers(input: string): number[] {
  if (!input.trim()) {
    return [];
  }

  // Split by comma or whitespace
  const tokens = input.split(/[\s,]+/);
  
  const numbers: number[] = [];
  const seen = new Set<number>();

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    const num = parseInt(trimmed, 10);
    
    // Only include valid numbers between 1-90 that haven't been seen yet
    if (!isNaN(num) && num >= 1 && num <= 90 && !seen.has(num)) {
      numbers.push(num);
      seen.add(num);
    }
  }

  return numbers;
}
