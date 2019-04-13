class Counter {
  constructor(runs, warmupRuns) {
    this.warmupRuns = warmupRuns;
    this.maxRuns = runs + warmupRuns;
    this.run = 0;
  }

  next() {
    const run = ++this.run;
    return {
      value: { 
        first: run === 1,
        warmup: run <= this.warmupRuns,
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