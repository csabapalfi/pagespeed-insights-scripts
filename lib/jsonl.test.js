const {results, stats} = require('./jsonl');

describe('jsonl formatter', () => {
  it('results are JSON.stringify-ed', () => {
    expect(results([{
      type: 'result',
      fetchTime: '21:48:05',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
    }])).toMatchSnapshot();
  });

  it('stats are JSON.stringify-ed', () => {
    expect(stats([{
      type: 'statistic',
      name: 'stddev',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
    }])).toMatchSnapshot();
  });
});