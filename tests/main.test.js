const {format: tsvFormat} = require('../lib/tsv');
const {format: jsonlFormat} = require('../lib/jsonl');
const {main} = require('../lib/main');

describe('main', () => {
  const mockOptions = (overrides = {}) => ({
    runs: 1, 
    warmupRuns: 0, 
    url: 'https://www.google.com',    
    getLighthouseResult: () => Promise.resolve({}),
    metrics: {},
    jsonl: false,
    ...overrides
  });

  it('uses tsvFormat by default', () => {
    const runner = main(mockOptions());
    expect(runner.format).toBe(tsvFormat);
  });

  it('uses jsonlFormat if specified', () => {
    const runner = main(mockOptions({jsonl: true}));
    expect(runner.format).toBe(jsonlFormat);
  });
});