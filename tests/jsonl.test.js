const {format} = require('../lib/jsonl');

describe('jsonl formatter', () => {
  it('entries are JSON.stringify-ed', () => {
    expect(format([{
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
});