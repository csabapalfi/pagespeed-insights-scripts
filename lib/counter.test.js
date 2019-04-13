const fc = require('fast-check');
const {Counter} = require('./counter');

describe('Counter', () => {
  it('returns a single first and last flag in the correct positions', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 100), fc.integer(0, 100), (r, w) => { 
          const runs = [...new Counter(r, w)];
          expect(runs.filter(({first}) => first)).toHaveLength(1);
          expect(runs[0]).toHaveProperty('first', true);
          expect(runs.filter(({last}) => last)).toHaveLength(1);
          expect(runs[runs.length -1]).toHaveProperty('last', true);
        }
      )
    );
  });

  it('returns the configured number of warmup and normal runs', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 100), fc.integer(0, 100), (r, w) => { 
          const runs = [...new Counter(r, w)];
          expect(runs.map(({warmup}) => warmup))
            .toEqual([
              ...new Array(w).fill(true),
              ...new Array(r).fill(false)
            ])
        }
      )
    );
  });
});
