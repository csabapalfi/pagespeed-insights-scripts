const {runPagespeed} = require('./run-psi');
const {mapResult} = require('./map-result');
const tsvFormat = require('./tsv');
const jsonlFormat = require('./jsonl');
const {getStats} = require('./stats');

function initCounters(runs, warmupRuns) {
  const maxRuns = runs + warmupRuns;
  return (run) => ({
    firstRun: run === 1,
    warmup: run <= warmupRuns,
    lastRun: run === maxRuns,
    done: run > maxRuns
  });
}

function main({
  getLightHouseResult = runPagespeed,
  url, runs, warmupRuns, metrics, output
}) {
  const {stats, jsonl} = output;
  const format = jsonl ? jsonlFormat : tsvFormat;
  const counters = initCounters(runs, warmupRuns);

  const samples = [];
  let run = 0;

  const resultsAndStats = {
    next: async () => {
      const {firstRun, warmup, lastRun, done} = counters(++run);
      if (done) {
        return Promise.resolve({done});
      }

      const lightHouseResult = await getLightHouseResult(url);
      const result = mapResult(lightHouseResult, metrics, warmup);
      if (!warmup) {
        samples.push(result);
      }

      const lines = [];
      lines.push(...format.result(result, firstRun));

      if (lastRun && stats) {
        lines.push(...format.stats(getStats(samples)));       
      }

      return Promise.resolve({value: lines, done});
    }
  };
  return {[Symbol.asyncIterator]: () => resultsAndStats};
}

module.exports = {main}