import { readableCron } from '../JobsTabHelper';

describe('JobTabsHelper', () => {
  it('readableCron', () => {
    expect(readableCron('01 * * * *')).toBe('hourly');
    expect(readableCron('01 01 * * *')).toBe('daily');
    expect(readableCron('01 01 * * 01')).toBe('weekly');
    expect(readableCron('01 01 01 * *')).toBe('monthly');
    expect(readableCron()).toBe('hourly');
  });
});
