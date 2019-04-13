const yargs = require('yargs');

const positionalArgAt =
  ({_: [,,...args]}, index) => args[index];

function check(argv) {
  const url = positionalArgAt(argv, 0);
  if (!url) {
    throw new Error('URL is required');
  }
  return new URL(url);
}

const options = {
  runs: {
    type: 'number',
    describe: 'Number of runs',
    group: 'Runs:',
    default: 9,
  },
  warmupRuns: {
    type: 'number',
    describe: 'Number of warmup runs',
    group: 'Runs:',
    default: 0,
  },
  userTimingMarks: {
    describe: 'User Timing marks',
    group: 'Additional metrics:',
    default: {},
    alias: 'metrics.userTimingMarks'
  },
  ttfb: {
    type: 'boolean',
    describe: 'TTFB',
    group: 'Additional metrics:',
    default: false,
    alias: 'metrics.ttfb',
  },
  benchmark: {
    type: 'boolean',
    describe: 'Benchmark index',
    group: 'Additional metrics:',
    default: false,
    alias: 'metrics.benchmark',
  },
  jsonl: {
    type: 'boolean',
    describe: 'Output as JSON Lines',
    group: 'Output:',
    default: false
  },
};

function parseArgs(argv) {
  const args = yargs(argv)
    .usage('$0 <URL>')
    .check(check)
    .options(options)
    .parse();
  
  const {runs, warmupRuns, metrics, jsonl, stats} = args;
  const url = positionalArgAt(args, 0);

  return {url, runs, warmupRuns, metrics, jsonl, stats};
}

module.exports = {parseArgs, check};