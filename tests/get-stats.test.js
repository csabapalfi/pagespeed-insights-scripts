const {getStats} = require('../lib/get-stats');

describe('stats', () => {
  const mockSample = (data) => ({
    type: 'result', name: 'run 1', ...data
  });

  const samples = [
    mockSample({score: 80, FCP: 1, FMP: 2, SI: 2, FCI: 5, TTI: 6}),
    mockSample({score: 90, FCP: 2, FMP: 3, SI: 3, FCI: 6, TTI: 7}),
  ]

  it('returns expected stats', () => {
    expect(getStats(samples))
      .toMatchSnapshot();
  });
});