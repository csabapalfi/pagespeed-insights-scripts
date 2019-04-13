const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {runPagespeed} = require('./run-pagespeed');
const {mapResult} = require('./map-result');
const {format: tsvFormat} = require('./tsv');
const {format: jsonlFormat} = require('./jsonl');

function main({
  runs, warmupRuns,
  getLightHouseResult = runPagespeed, url, metrics,
  jsonl,
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = async () =>
    mapResult(await getLightHouseResult(url), metrics);
  const format = jsonl ? jsonlFormat : tsvFormat;
  return new Runner(counter, getResult, format);
}

module.exports = {main};