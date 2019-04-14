const {main} = require('../lib/main');

describe('main', () => {
  const options = {
    runs: 1, 
    warmupRuns: 0, 
    getLighthouseResult: jest.fn(),
    url: 'https://www.google.com',
    metrics: {userTimingMarks: {}},
    output: {jsonl: false, reports: false},
  };

  it('returns runner', () => {
    expect(main(options)).toMatchSnapshot();
  });

  it('runner.getResult calls getLighthouseResult then mapResult', async () => {
    const lighthouseResult = {
      categories: {performance: {score: 1}},
      audits: {}
    };

    const {getLighthouseResult} = options;
    getLighthouseResult.mockResolvedValue(lighthouseResult);
        
    const runner = main(options);
    const mappedResult = await runner.getResult();

    expect(mappedResult.score).toEqual(100);
    expect(getLighthouseResult).toHaveBeenCalledTimes(1);
    expect(getLighthouseResult).toHaveBeenCalledWith(options.url);
  });
});