const {Counter} = require('./counter');
const {runPagespeed} = require('./run-psi');
const {mapResult} = require('./map-result');
const tsvFormat = require('./tsv');
const jsonlFormat = require('./jsonl');
const {getStats} = require('./stats');

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
      const {value: {first, warmup, last}, done} = counter.next();
      if (done) {
        return Promise.resolve({done});
      }

      const result = await runTest();
      if (!warmup) {
        samples.push(result);
      }

      const output = [];
      output.push(...formatter.result(result, first));

      if (last && stats) {
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
  const counter = new Counter(runs, warmupRuns);
  const runTest = runTestTask(getLightHouseResult, url, metrics);
  const format = jsonl ? jsonlFormat : tsvFormat;

  return {
    [Symbol.asyncIterator]: () =>
      runIterator(counter, runTest, format, stats)
  };
}

module.exports = {main, runTestTask, runIterator};