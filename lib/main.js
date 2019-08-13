const {Counter} = require('./counter');
const {Fetcher} = require('./fetcher');
const {Formatter} = require('./formatter');
const {Runner} = require('./runner');

function main({
  runs, warmupRuns,
  url, metrics, lighthouse,
  output, strategy,
}) {
  const counter = new Counter(runs, warmupRuns);
  const fetcher = new Fetcher(url, metrics, lighthouse, strategy, output);
  const formatter = new Formatter(output.jsonl);
  return new Runner(counter, fetcher, formatter);
}

module.exports = {main};
