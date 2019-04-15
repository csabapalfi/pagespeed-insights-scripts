const {mapMarkValue, mapTTFB} = require('../lib/map-result');

describe('map-result', () => {
  describe('mapMarkValue', () => {
    it('returns NaN if no mark found', () => {
      expect(mapMarkValue(null))
        .toBe(NaN);
    });

    it('returns NaN if mark has no startTime', () => {
      expect(mapMarkValue({}))
        .toBe(NaN);
    });

    it('returns formatted ms value if mark has startTime', () => {
      expect(mapMarkValue({startTime: 785}))
        .toBe(0.79);
    });
  });

  describe('mapTTFB', () => {
    const audit = {displayValue: 'Root document took 240 ms'};
    expect(mapTTFB(audit)).toBe(0.24);
  });
});