import internals from './useMaskedInput';

describe('useMaskedInput hook', () => {
  test('maskValue', () => {
    const phonePattern = internals.createPattern('(\\050) 000-0000');
    const maskWithPhone = (value: string) =>
      internals.maskValue(value, phonePattern);

    expect(maskWithPhone('0584003033').value).toBe('(058) 400-3033');
    expect(maskWithPhone('0529280393').value).toBe('(052) 928-0393');
    expect(maskWithPhone('0511111111').value).toBe('(051) 111-1111');
    expect(maskWithPhone('0501234567').value).toBe('(050) 123-4567');
    expect(maskWithPhone('584003033').value).not.toBe('(058) 400-3033');
    expect(maskWithPhone('').value).toBe('');
  });

  test('unmaskValue', () => {
    const phonePattern = internals.createPattern('(\\050) 000-0000');
    const unmaskWithPhone = (value: string) =>
      internals.unmaskValue(value, phonePattern);

    expect(unmaskWithPhone('(058) 400-3033')).toBe('0584003033');
    expect(unmaskWithPhone('(052) 928-0393')).toBe('0529280393');
    expect(unmaskWithPhone('')).toBe('');
  });
});
