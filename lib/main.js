const {Counter} = require('./counter');
const {Fetcher} = require('./fetcher');
const {Formatter} = require('./formatter');
const {Runner} = require('./runner');

function main({
  runs, warmupRuns,
  url, metrics, lighthouse,
  output: {saveAssets, jsonl}, 
}) {
  const counter = new Counter(runs, warmupRuns);
  const fetcher = new Fetcher(url, metrics, lighthouse, saveAssets);
  const formatter = new Formatter(jsonl);
  return new Runner(counter, fetcher, formatter);
}

module.exports = {main};