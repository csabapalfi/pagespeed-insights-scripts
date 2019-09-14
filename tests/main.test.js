const main = require('../lib/main');

describe('main', () => {
  const options = {
    runs: 1,
    warmupRuns: 0,
    url: 'https://www.google.com',
    metrics: {userTimingMarks: {}},
    lighthouse: {enabled: false},
    output: {jsonl: false, saveAssets: false},
  };

  it('returns runner', () => {
    expect(main(options)).toMatchSnapshot();
  });
});