const {Formatter, tsvFormat, jsonlFormat} = 
  require('../lib/formatter');

describe('formatter', () => {
  describe('tsv format', () => {
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
        expect(tsvFormat([result], {}))
          .toMatchSnapshot();
      });
    
      it('heading row added before first result', () => {
        expect(tsvFormat([result], {first: true}))
          .toMatchSnapshot();
      });

      it('userTimingMark uses default number format precision (2 digits)', () => {
        expect(tsvFormat([{...result, DPA: 1.25}], {}))
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
        expect(tsvFormat([statistic]))
          .toMatchSnapshot();
      });

      it('stddev uses custom precision for score (1 digit)', () => {
        expect(tsvFormat([{...statistic, name: 'stddev'}]))
          .toMatchSnapshot();
      });
    });
  });

  describe('jsonl format', () => {
    it('entries are JSON.stringify-ed', () => {
      expect(jsonlFormat([{
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

  describe('output formatter', () => {
    it('return jsonlFormat if jsonl enabled', () => {
      expect(new Formatter(true).format).toBe(jsonlFormat);
    });

    it('return tsvFormat if jsonl disabled', () => {
      expect(new Formatter(false).format).toBe(tsvFormat);
    });
  });
});