const {runPagespeed} = require('./run-psi');
const {mapResult} = require('./map-result');
const tsvFormat = require('./tsv');
const jsonlFormat = require('./jsonl');
const {getStats} = require('./stats');

function getCounter(runs, warmupRuns) {
  const maxRuns = runs + warmupRuns;
  let run = 0;
  return {
    next: () => {
      run++;
      return {
        firstRun: run === 1,
        warmup: run <= warmupRuns,
        lastRun: run === maxRuns,
        done: run > maxRuns
      }
    }
  };
}

function runTestTask(getLightHouseResult, url, metrics) {
  return async () => {
    const lightHouseResult = await getLightHouseResult(url);
    return mapResult(lightHouseResult, metrics);
  };
}

function runIterator(counter, runTest, formatter, stats) {
  const samples = [];
  return {
    next: async () => {
      const {firstRun, warmup, lastRun, done} = counter.next();
      if (done) {
        return Promise.resolve({done});
      }

      const result = await runTest();
      if (!warmup) {
        samples.push(result);
      }

      const output = [];
      output.push(...formatter.result(result, firstRun));

      if (lastRun && stats) {
        output.push(...formatter.stats(getStats(samples)));       
      }

      return Promise.resolve({value: output, done});
    }
  };
}

function main({
  getLightHouseResult = runPagespeed, url, metrics,
  runs, warmupRuns, jsonl, stats
}) {
  const counter = getCounter(runs, warmupRuns);
  const runTest = runTestTask(getLightHouseResult, url, metrics);
  const format = jsonl ? jsonlFormat : tsvFormat;

  return {
    [Symbol.asyncIterator]: () =>
      runIterator(counter, runTest, format, stats)
  };
}

module.exports = {main, getCounter, runTestTask, runIterator};