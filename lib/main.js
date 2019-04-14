const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {resultMapper} = require('./map-result');
const {outputFormatter} = require('./format-output');

function main({
  runs, warmupRuns,
  getLighthouseResult, url, metrics,
  jsonl,
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = () =>
    getLighthouseResult(url).then(resultMapper(metrics));
  const format = outputFormatter(jsonl);
  return new Runner(counter, getResult, format);
}

module.exports = {main};