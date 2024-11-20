const assert = (assertion: boolean, message?: string) => {
  if (!assertion) throw new Error('Assertion error: ' + message);
};

export function generateLuhnCheckDigit(payload: string) {
  assert(/^\d+$/.test(payload), 'payload must consist only of digits');

  const sum = Array.from(payload).reduceRight(
    (accum, currentDigit, currentIndex, array) => {
      const reversedIndex = array.length - currentIndex - 1;
      const multiplier = reversedIndex % 2 === 0 ? 2 : 1;
      const multiplication = parseInt(currentDigit) * multiplier;
      const result = multiplication < 10 ? multiplication : multiplication - 9;
      return accum + result;
    },
    0,
  );
  return (10 - (sum % 10)) % 10;
}

export function validateWithLuhn(number: string) {
  assert(/^\d+$/.test(number), 'number must consist only of digits');

  const payload = number.substring(0, number.length - 1);
  const check = parseInt(number.charAt(number.length - 1));
  return generateLuhnCheckDigit(payload) === check;
}
