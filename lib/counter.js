class Counter {
  constructor(runs) {
    this.maxRuns = runs;
    this.run = 0;
  }

  next() {
    const run = ++this.run;
    return {
      value: {
        index: run,
        first: run === 1,
        last: run === this.maxRuns,
      },
      done: run > this.maxRuns
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

module.exports = {Counter};