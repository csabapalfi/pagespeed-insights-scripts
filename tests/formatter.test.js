const format = require('../lib/formatter');

describe('format', () => {
  describe('results', () => {
    const result = {
      type: 'result',
      name: 'run 1',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
    };

    it('are formatted as expected', () => {
      expect(format([result], {}))
        .toMatchSnapshot();
    });
  
    it('heading row added before first result', () => {
      expect(format([result], {first: true}))
        .toMatchSnapshot();
    });

    it('userTimingMark uses default number format precision (2 digits)', () => {
      expect(format([{...result, DPA: 1.25}], {}))
        .toMatchSnapshot();
    });
  });

  describe('stats', () => {
    const statistic = {
      type: 'statistic',
      name: 'median',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
    };
  
    it('stats are formatted as expected', () => {
      expect(format([statistic]))
        .toMatchSnapshot();
    });

    it('stddev uses custom precision for score (1 digit)', () => {
      expect(format([{...statistic, name: 'stddev'}]))
        .toMatchSnapshot();
    });
  });
});