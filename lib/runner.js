const {getStats} = require('./get-stats');
const format = require('./formatter');

class Runner {
  constructor(counter, fetcher) {
    this.counter = counter;
    this.fetcher = fetcher;
    this.samples = [];
  }

  async next() {
    const {counter, fetcher, samples} = this; 
    const {value: run, done} = counter.next();
    if (done) {
      return Promise.resolve({done});
    }

    const result = await fetcher.getResult(run.index);

    if (!run.warmup) {
      samples.push(result);
    }

    const output = [...format([result], run)];

    if (run.last && samples.length > 1) {
      const stats = getStats(samples);
      output.push(...format(stats));    
    }

    return Promise.resolve({value: output, done});
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

module.exports = {Runner};