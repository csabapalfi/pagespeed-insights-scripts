const {Counter} = require('./counter');
const {Runner} = require('./runner');
const {saveAssets} = require('./save-assets');
const {resultMapper} = require('./map-result');
const {outputFormatter} = require('./format-output');

function main({
  runs, warmupRuns,
  getLighthouseResult, url, metrics,
  output
}) {
  const counter = new Counter(runs, warmupRuns);
  const getResult = () =>
    getLighthouseResult(url).then(async ({result, artifacts}) => {
      if (output.saveAssets) {
        await saveAssets(result, artifacts);
      }
      return resultMapper(metrics)(result);
    });
  const format = outputFormatter(output.jsonl);
  return new Runner(counter, getResult, format);
}

module.exports = {main};