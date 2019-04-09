import {median} from 'simple-statistics';
import test from './api';
import getMetrics from './metrics';
import yargs from 'yargs';

export async function main() {
  const argv = yargs
    .boolean('v')
    .default('skippedRuns', 0)
    .default('runs', 9)
    .argv;

  const {v: verbose, skippedRuns, runs, _:[url]} = argv;

  const results = [];
  verbose && console.log('score\tTTFB\tFCP\tFMP\tSI\tFCI\tTTI\tbenchmarkIndex\tfetchTime')
  for (let runsLeft = runs + skippedRuns; runsLeft > 0; runsLeft--) {
    const result = getMetrics(await test(url));
    if (runsLeft <= runs) {
      verbose && console.log(result.join('\t'));
      results.push(result);
    } else {
      const [score, ...rest] = result;
      verbose && console.log([`(${score})`, ...rest].join('\t'));
    }
  }

  console.log(median(results.map(([score, ...rest]) => score)))
}
