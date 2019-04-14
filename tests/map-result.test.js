const {mapUserTimingMarkValue, mapTTFB} = require('../lib/map-result');

describe('map-result', () => {
  describe('mapUserTimingMarkValue', () => {
    const mark = 'my.timing.mark';
    const mockAudits = (items) => ({
      ['user-timings']: {
        details: {items}
      }
    });

    it('returns NaN if no mark found', () => {
      const audits = mockAudits([]);
      expect(mapUserTimingMarkValue(audits, mark))
        .toBe(NaN);
    });

    it('returns NaN if mark has no startTime', () => {
      const audits = mockAudits([{name: mark}])
      expect(mapUserTimingMarkValue(audits, mark))
        .toBe(NaN);
    });

    it('returns formatted ms value if mark has startTime', () => {
      const audits = mockAudits([{name: mark, startTime: 785}])
      expect(mapUserTimingMarkValue(audits, mark))
        .toBe(0.79);
    });
  });

  describe('mapTTFB', () => {
    const name = 'time-to-first-byte';
    const audits = {
      [name]: {displayValue: 'Root document took 240 ms'}
    };
    expect(mapTTFB(audits, name)).toBe(0.24);
  });
});