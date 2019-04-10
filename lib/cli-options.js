import yargs from 'yargs';

export default function getOptions() {
  const {argv} = yargs
    .command('*', 'run pagespeed tests', () => {}, () => {
      yargs
        .positional('url', {
          type: 'string', describe: 'url to test'
        })
    })
    .options({
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
        describe: 'Specified User Timing marks',
        group: 'Additional metrics:',
        default: {},
      },
      ttfb: {
        type: 'boolean',
        describe: 'TTFB',
        group: 'Additional metrics:',
        default: false,
      },
      benchmark: {
        type: 'boolean',
        describe: 'Benchmark index',
        group: 'Additional metrics:',
        default: false,
      },
      stats: {
        type: 'boolean',
        describe: 'Output result statistics',
        group: 'Output:',
        default: true,
      },
      jsonl: {
        type: 'boolean',
        describe: 'Output as JSON Lines',
        group: 'Output:',
        default: false,
      },
    });

    const { 
      _:[url],
      runs, 
      warmupRuns, 
      stats,
      jsonl,
      userTimingMarks,
      ttfb,
      benchmark
    } = argv;

    return {
      url,
      runs, 
      warmupRuns,
      additionalMetrics: {userTimingMarks, ttfb, benchmark},
      output: {stats, jsonl}
    };
}