const {formatRow, formatHeading} = require('../lib/format');

describe('format', () => {
  describe('results', () => {
    const result = {
      name: 'run 1',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
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
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
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