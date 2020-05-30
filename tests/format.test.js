const {formatRow, formatHeading} = require('../lib/format');

describe('format', () => {
  describe('results', () => {
    const result = {
      name: 'run 1',
      score: 95,
      FCP: 0.9,
      SI: 1.1,
      LCP: 1,
      TTI: 4,
      TBT: 5,
      CLS: 0.0
    };

    it('results are formatted as expected', () => {
      expect(formatRow(result)).toMatchSnapshot();
    });
  
    it('heading row is formatted as expected', () => {
      expect(formatHeading(result)).toMatchSnapshot();
    });
  });

  describe('stats', () => {
    const statistic = {
      name: 'median',
      score: 95,
      FCP: 0.9,
      SI: 1.1,
      LCP: 1,
      TTI: 4,
      TBT: 5,
      CLS: 0.0
    };
  
    it('stats are formatted as expected', () => {
      expect(formatRow(statistic))
        .toMatchSnapshot();
    });

    it('stddev uses custom precision for score (1 digit)', () => {
      expect(formatRow({...statistic, name: 'stddev'}))
        .toMatchSnapshot();
    });
  });
});