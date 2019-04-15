const {getStats} = require('./get-stats');

class Runner {
  constructor(counter, fetcher, formatter) {
    this.counter = counter;
    this.fetcher = fetcher;
    this.formatter = formatter;
    this.samples = [];
  }

  async next() {
    const {counter, fetcher, formatter, samples} = this; 
    const {value: run, done} = counter.next();
    if (done) {
      return Promise.resolve({done});
    }

    const result = await fetcher.getResult(run.index);

    if (!run.warmup) {
      samples.push(result);
    }

    const output = [...formatter.format([result], run)];

    if (run.last && samples.length > 1) {
      const stats = getStats(samples);
      output.push(...formatter.format(stats));    
    }

    return Promise.resolve({value: output, done});
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

module.exports = {Runner};