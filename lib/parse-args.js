const yargs = require('yargs');

const options = {
  'runs': {
    type: 'number',
    describe: 'Number of runs',
    group: 'Basic options:',
    default: 1,
  },
  'strategy': {
    type: 'string',
    describe: 'Strategy (mobile or desktop)',
    group: 'Basic options:',
    default: 'mobile',
  },
  'save-results': {
    type: 'boolean',
    describe: 'Save result JSON to disk',
    group: 'Basic options:',
    default: false,
  },
  'local': {
    type: 'boolean',
    describe: 'Use local Lighthouse instead of PageSpeed API',
    group: 'Basic options:',
    default: false
  },
  'cpu-slowdown': {
    type: 'number',
    describe: 'CPU slowdown multiplier',
    group: 'Local only options:',
    default: 4,
  },
  'save-assets': {
    type: 'boolean',
    describe: 'Save the trace & devtools log to disk',
    group: 'Local only options:',
    default: false,
  }
}

const positionalArgAt =
  ({_: [,,...args]}, index) => args[index];

function check(argv) {
  const url = positionalArgAt(argv, 0);
  if (!url) {
    throw new Error('URL is required');
  }

  if (
    argv.cpuSlowdown && 
    argv.cpuSlowdown !== options['cpu-slowdown'].default && 
    !argv.local
  ) {
    throw new Error('--cpu-slowdown only works with --local');
  }

  if (argv.saveAssets && !argv.local) {
    throw new Error('--save-assets only works with --local');
  }

  return new URL(url);
}

const buildLocalConfig = 
  ({local, cpuSlowDown, saveAssets}) => 
    ({enabled: local, cpuSlowDown, saveAssets});

function parseArgs({argv}) {
  const args = yargs(argv)
    .usage('$0 <URL>')
    .check(check)
    .options(options)
    .parse();

  const url = positionalArgAt(args, 0);
  const {runs, strategy, saveResults} = args;
  const local = buildLocalConfig(args);
  return {url, runs, strategy, saveResults, local};
}

module.exports = {parseArgs, check};
