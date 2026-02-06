/**
 * Parse a speech transcript into an array of integers suitable for Verify Called Numbers.
 * Extracts digit sequences and normalizes common spoken number words.
 * Returns the first 15 valid numbers (1-90) in spoken order.
 */

// Map of spoken number words to digits
const numberWords: Record<string, number> = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
  'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
  'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
};

// Compound numbers like "twenty one" -> 21
const tensWords = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const onesWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export function parseSpokenNumbers(transcript: string): number[] {
  if (!transcript.trim()) {
    return [];
  }

  const numbers: number[] = [];
  const text = transcript.toLowerCase().trim();
  
  // Split by common separators and clean
  const tokens = text.split(/[\s,;.]+/).filter(t => t.length > 0);
  
  let i = 0;
  while (i < tokens.length && numbers.length < 15) {
    const token = tokens[i];
    
    // Try to parse as direct number
    const directNum = parseInt(token, 10);
    if (!isNaN(directNum) && directNum >= 1 && directNum <= 90) {
      numbers.push(directNum);
      i++;
      continue;
    }
    
    // Try to parse as number word
    if (token in numberWords) {
      const num = numberWords[token];
      
      // Check for compound numbers like "twenty one"
      if (tensWords.includes(token) && i + 1 < tokens.length) {
        const nextToken = tokens[i + 1];
        if (onesWords.includes(nextToken)) {
          const compoundNum = num + numberWords[nextToken];
          if (compoundNum >= 1 && compoundNum <= 90) {
            numbers.push(compoundNum);
            i += 2;
            continue;
          }
        }
      }
      
      // Single number word
      if (num >= 1 && num <= 90) {
        numbers.push(num);
      }
      i++;
      continue;
    }
    
    // Skip unrecognized tokens
    i++;
  }
  
  // Return first 15 valid numbers, removing duplicates while preserving order
  const seen = new Set<number>();
  const result: number[] = [];
  
  for (const num of numbers) {
    if (!seen.has(num) && result.length < 15) {
      seen.add(num);
      result.push(num);
    }
  }
  
  return result;
}
