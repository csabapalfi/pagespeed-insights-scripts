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
  'runs': {
    type: 'number',
    describe: 'Number of runs',
    group: 'Runs:',
    default: 1,
  },
  'save-assets': {
    type: 'boolean',
    describe: 'Save reports and traces',
    group: 'Output:',
    default: false,
    alias: 'output.saveAssets',
  },
  'local': {
    type: 'boolean',
    describe: 'Switch to local Lighthouse',
    group: 'Lighthouse:',
    alias: 'lighthouse.enabled',
    default: false
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
  const {runs, output, lighthouse, strategy} = args;

  return {url, runs, output, lighthouse, strategy};
}

module.exports = {parseArgs, check};
