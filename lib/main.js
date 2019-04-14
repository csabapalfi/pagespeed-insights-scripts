const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {saveReport} = require('./save-report');
const {resultMapper} = require('./map-result');
const {outputFormatter} = require('./format-output');

function main({
  runs, warmupRuns,
  getLighthouseResult, url, metrics,
  output
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = () =>
    getLighthouseResult(url).then((result) => {
      if (output.reports) {
        saveReport(result);
      }
      return resultMapper(metrics)(result);
    });
  const format = outputFormatter(output.jsonl);
  return new Runner(counter, getResult, format);
}

module.exports = {main};