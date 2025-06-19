// src/utils/phoneCleaner.js

// Enhanced mapping of spoken tokens to digits
const WORD_DIGIT_MAP = {
  zero: '0', oh: '0', o: '0', nil: '0',
  one: '1', two: '2', three: '3',
  four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9',
};

/**
 * Extract digits from a free-form transcript, handling:
 * - number words (zero, one, two, etc.)
 * - raw digits
 * - 'double X' or 'twice X' -> XX
 * - 'triple X' -> XXX
 */
export function extractDigits(transcript = '') {
  const tokens = transcript
    .toLowerCase()
    .match(/\w+/g) || [];

  const digits = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    // Handle 'double X' or 'twice X' -> XX
    if ((tok === 'double' || tok === 'twice') && tokens[i + 1]) {
      const next = tokens[i + 1];
      const d = WORD_DIGIT_MAP[next];
      if (d !== undefined) {
        digits.push(d, d);
        i++; // consume the next token
        continue;
      }
    }

    // Handle 'triple X' -> XXX
    if (tok === 'triple' && tokens[i + 1]) {
      const next = tokens[i + 1];
      const d = WORD_DIGIT_MAP[next];
      if (d !== undefined) {
        digits.push(d, d, d);
        i++;
        continue;
      }
    }

    // Number word -> digit
    if (WORD_DIGIT_MAP[tok] !== undefined) {
      digits.push(WORD_DIGIT_MAP[tok]);
      continue;
    }

    // Raw digit string (e.g. '14100')
    if (/^\d+$/.test(tok)) {
      digits.push(...tok.split(''));
      continue;
    }

    // ignore other tokens
  }

  // Return up to first 10 digits as a string
  return digits.slice(0, 10).join('');
}

/**
 * Format a 10-digit Australian-style number: '04 XXXX XXXX'
 */
export function formatPhoneNumber(digitsString) {
  const digits = digitsString.replace(/\D/g, '');
  if (digits.length !== 10) return digits;
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 6);
  const part3 = digits.slice(6, 10);
  return `${part1} ${part2} ${part3}`;
}
