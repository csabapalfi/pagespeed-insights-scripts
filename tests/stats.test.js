const stats = require('../lib/stats');

describe('stats', () => {
  const mockSample = (data) => ({
    name: 'run 1', ...data
  });

  const samples = [
    mockSample({score: 80, FCP: 1, SI: 2, LCP: 3, TTI: 6, TBT: 5, CLS: 0.1}),
    mockSample({score: 90, FCP: 2, SI: 3, LCP: 4, TTI: 7, TBT: 6, CLS: 0.0}),
  ]

  it('returns expected stats', () => {
    expect(stats(samples))
      .toMatchSnapshot();
  });
});