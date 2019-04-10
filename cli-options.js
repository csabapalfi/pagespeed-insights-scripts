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
        default: 9,
      },
      warmupRuns: {
        type: 'number',
        describe: 'Number of warmup runs',
        default: 0,
      },
      stats: {
        type: 'boolean',
        describe: 'Output stats',
        default: true,
      },
      'userTimingMarks': {
        describe: 'User Timing marks to include in metrics',
        default: {}
      },
      format: {
        type: 'string',
        describe: 'Output format',
        choices: ['jsonl', 'tsv'],
        default: 'tsv'
      },
    });

    const { 
      _:[url], 
      runs, 
      warmupRuns, 
      stats, 
      format,
      userTimingMarks
    } = argv;

    return {
      url,
      runs, 
      warmupRuns, 
      stats, 
      tsv: format === 'tsv',
      jsonl: format === 'jsonl',
      userTimingMarks
    };
}