const {Runner} = require('../lib/runner');

describe('runner', () => {
  const result = {metric: 1};
  const counter =
    ({done = false, ...value} = {}) => ({next: () => ({value, done})});
  const getResult = () => Promise.resolve(result);
  const format = (x) => x;

  it('returns this as asyncIterator', () => {
    const runner = new Runner();
    expect(runner[Symbol.asyncIterator]()).toBe(runner);
  });

  it('resolves with done if counter is done', () => {
    const runner = new Runner(counter({done: true}));
    return expect(runner.next())
      .resolves.toEqual({done: true});
  });

  describe('resolves with result ', () => {
    const resolvedResult = {value: [result], done: false};
    it('that is added to samples', async () => {
      const runner = new Runner(counter(), getResult, format);
      await expect(runner.next()).resolves.toEqual(resolvedResult);
      expect(runner.samples).toContain(result);
    });

    it('that is not added to samples if warmup result ', async () => {
      const runner = new Runner(counter({warmup: true}), getResult, format);
      await expect(runner.next()).resolves.toEqual(resolvedResult);
      expect(runner.samples).not.toContain(result);
    });

    it('and no stats if last run but not enough samples (<2)', () => {
        const runner = new Runner(counter({last: true}), getResult, format);
        return expect(runner.next()).resolves.toEqual(resolvedResult);
    });

    it('and stats if last run and enough samples', () => {
        const runner = new Runner(counter({last: true}), getResult, format);
        runner.samples = [{metric: 2}];
        return expect(runner.next()).resolves.toMatchSnapshot();
    });
  });
});