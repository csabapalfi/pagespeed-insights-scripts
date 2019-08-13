const yargs = require('yargs');

const positionalArgAt =
  ({_: [,,...args]}, index) => args[index];

function check(argv) {
  const url = positionalArgAt(argv, 0);
  if (!url) {
    throw new Error('URL is required');
  }
  if (argv.lanternDebug && !argv.local) {
    throw new Error('--lantern-debug only works with --local');
  }
  return new URL(url);
}

const options = {
  'runs': {
    type: 'number',
    describe: 'Number of runs',
    group: 'Runs:',
    default: 1,
  },
  'warmup-runs': {
    type: 'number',
    describe: 'Number of warmup runs',
    group: 'Runs:',
    default: 0,
  },
  'usertiming-marks': {
    describe: 'User Timing marks',
    group: 'Additional metrics:',
    default: {},
    alias: 'metrics.userTimingMarks'
  },
  'ttfb': {
    type: 'boolean',
    describe: 'TTFB',
    group: 'Additional metrics:',
    default: false,
    alias: 'metrics.ttfb',
  },
  'benchmark': {
    type: 'boolean',
    describe: 'Benchmark index',
    group: 'Additional metrics:',
    default: false,
    alias: 'metrics.benchmark',
  },
  'jsonl': {
    type: 'boolean',
    describe: 'Output as JSON Lines',
    group: 'Output:',
    default: false,
    alias: 'output.jsonl',
  },
  'save-assets': {
    type: 'boolean',
    describe: 'Save reports and traces',
    group: 'Output:',
    default: false,
    alias: 'output.saveAssets',
  },
  'file-prefix': {
    type: 'string',
    describe: 'Saved asset file prefix',
    group: 'Output:',
    default: '',
    alias: 'output.filePrefix',
  },
  'lantern-debug': {
    type: 'boolean',
    describe: 'Save Lantern traces',
    group: 'Output:',
    default: false,
    alias: 'output.lanternDebug',
  },
  'local': {
    type: 'boolean',
    describe: 'Switch to local Lighthouse',
    group: 'Lighthouse:',
    alias: 'lighthouse.enabled',
    default: false
  },
  'lighthouse-path': {
    type: 'string',
    describe: 'Lighthouse module path',
    group: 'Lighthouse:',
    default: 'lighthouse',
    alias: 'lighthouse.modulePath',
  },
  'cpu-slowdown': {
    type: 'number',
    describe: 'CPU slowdown multiplier',
    group: 'Lighthouse:',
    default: 4,
    alias: 'lighthouse.cpuSlowDown',
  },
  'strategy': {
    type: 'string',
    describe: 'Lighthouse strategy [mobile | desktop]',
    group: 'Additional metrics:',
    default: 'mobile',
  },
};

function parseArgs({argv}) {
  const args = yargs(argv)
    .usage('$0 <URL>')
    .check(check)
    .options(options)
    .parse();

  const url = positionalArgAt(args, 0);
  const {runs, warmupRuns, metrics, output, lighthouse, strategy} = args;

  return {url, runs, warmupRuns, metrics, output, lighthouse, strategy};
}

module.exports = {parseArgs, check};
