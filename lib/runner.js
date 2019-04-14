const {getStats} = require('./get-stats');

class Runner {
  constructor(counter, getResult, format) {
    this.counter = counter;
    this.getResult = getResult;
    this.format = format;
    this.samples = [];
  }

  async next() {
    const {counter, getResult, format, samples} = this; 
    const {value: run, done} = counter.next();
    if (done) {
      return Promise.resolve({done});
    }

    const result = await getResult();

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