import { generateLuhnCheckDigit, validateWithLuhn } from './luhn-algorithm';

describe('Luhn Algorithm', () => {
  test('Generating check digit', () => {
    expect(generateLuhnCheckDigit('1789372997')).toBe(4);
    expect(generateLuhnCheckDigit('084530073')).toBe(0);
    expect(generateLuhnCheckDigit('019139607')).toBe(6);
    expect(generateLuhnCheckDigit('3801')).toBe(8);
    expect(generateLuhnCheckDigit('2680777312565317223')).toBe(7);
  });

  test('Validating', () => {
    expect(validateWithLuhn('533255883827475')).toBe(true);
    expect(validateWithLuhn('751947572895')).toBe(true);
    expect(validateWithLuhn('644226714')).toBe(true);
    expect(validateWithLuhn('508894232825813')).toBe(true);
    expect(validateWithLuhn('966821123813077')).toBe(false);
    expect(validateWithLuhn('731')).toBe(false);
    expect(validateWithLuhn('85914256378389172581')).toBe(false);
    expect(validateWithLuhn('86080')).toBe(false);
  });
});
