const {Counter} = require('./counter');
const {Fetcher} = require('./fetcher');
const {Runner} = require('./runner');

function main({
  runs, warmupRuns,
  url, lighthouse,
  output, strategy,
}) {
  const counter = new Counter(runs, warmupRuns);
  const fetcher = new Fetcher(url, lighthouse, strategy, output);
  return new Runner(counter, fetcher);
}

module.exports = main;
