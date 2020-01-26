const fc = require('fast-check');
const {Counter} = require('../lib/counter');

describe('Counter', () => {
  it('returns a single first and last flag in the correct positions', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 100), (r) => { 
          const runs = [...new Counter(r)];
          expect(runs.filter(({first}) => first)).toHaveLength(1);
          expect(runs[0]).toHaveProperty('first', true);
          expect(runs.filter(({last}) => last)).toHaveLength(1);
          expect(runs[runs.length -1]).toHaveProperty('last', true);
        }
      )
    );
  });
});
