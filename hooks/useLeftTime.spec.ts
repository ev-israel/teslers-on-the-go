import { act, renderHook } from '@testing-library/react-native';
import { useLeftTime } from './useLeftTime';

describe('useLeftTime', () => {
  const RESOLUTION_MS = 1000;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return null as we don't track time left", () => {
    const { result } = renderHook(() => useLeftTime(null, RESOLUTION_MS));
    const [, hasReachedTarget] = result.current;

    expect(hasReachedTarget).toBe(false);
  });

  it('should return reached as we are querying past time', () => {
    const pastDate = new Date(Date.now() - 10000);
    const { result } = renderHook(() => useLeftTime(pastDate, RESOLUTION_MS));
    const [, hasReachedTarget] = result.current;

    expect(hasReachedTarget).toBe(true);
  });

  it('should calculate leftTime correctly when target date is in the future', () => {
    const futureDate = new Date(Date.now() + 10000);

    const { result } = renderHook(() => useLeftTime(futureDate, RESOLUTION_MS));

    expect(result.current[0]).toBeCloseTo(10000, -2);
    expect(result.current[1]).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBeCloseTo(9000, -2);
    expect(result.current[1]).toBe(false);
  });

  it('should stop counting down and mark as reached when target time is reached', () => {
    const futureDate = new Date(Date.now() + 5000);

    const { result } = renderHook(() => useLeftTime(futureDate, RESOLUTION_MS));

    expect(result.current[0]).toBeCloseTo(5000, -2);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current[1]).toBe(true);
  });
});
