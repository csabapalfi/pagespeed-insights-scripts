const {results, stats} = require('./tsv');

describe('tsv formatter', () => {
  describe('results', () => {
    const result = {
      type: 'result',
      fetchTime: '21:48:05',
      score: 95,
      FCP: 0.9,
      FMP: 1,
      SI: 1.1,
      FCI: 3.2,
      TTI: 4
    };

    it('are formatted as expected', () => {
      expect(results([result]))
        .toMatchSnapshot();
    });
  
    it('heading row added before first result', () => {
      expect(results([result], true))
        .toMatchSnapshot();
    });

    it('userTimingMark uses default number format precision (2 digits)', () => {
      expect(results([{...result, DPA: 1.25}]))
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
      expect(stats([statistic]))
        .toMatchSnapshot();
    });

    it('stddev uses custom precision for score (1 digit)', () => {
      expect(stats([{...statistic, name: 'stddev'}]))
        .toMatchSnapshot();
    });
  });

});