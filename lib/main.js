const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {mapResult} = require('./map-result');
const {format: tsvFormat} = require('./tsv');
const {format: jsonlFormat} = require('./jsonl');

function main({
  runs, warmupRuns,
  getLighthouseResult, url, metrics,
  jsonl,
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = () =>
    getLighthouseResult(url).then(mapResult(metrics));
  const format = jsonl ? jsonlFormat : tsvFormat;
  return new Runner(counter, getResult, format);
}

module.exports = {main};