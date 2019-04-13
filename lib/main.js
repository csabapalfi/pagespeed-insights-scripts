const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {runPagespeed} = require('./run-psi');
const {mapResult} = require('./map-result');
const {format: tsvFormat} = require('./tsv');
const {format: jsonlFormat} = require('./jsonl');

function getResultTask(getLightHouseResult, url, metrics) {
  return async () => {
    const lightHouseResult = await getLightHouseResult(url);
    return mapResult(lightHouseResult, metrics);
  };
}

function main({
  runs, warmupRuns, 
  getLightHouseResult = runPagespeed, url, metrics,
  jsonl,
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = getResultTask(getLightHouseResult, url, metrics);
  const format = jsonl ? jsonlFormat : tsvFormat;
  return new Runner(counter, getResult, format);
}

module.exports = {main, getResultTask};