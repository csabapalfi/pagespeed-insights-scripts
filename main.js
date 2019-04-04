import {median} from 'simple-statistics';
import apiTest from './api';
import localTest from './local';
import getMetrics from './metrics';
import yargs from 'yargs';

export async function main() {
  const argv = yargs
    .boolean('local')
    .boolean('v')
    .default('runs', 9)
    .argv;
  const {local, v: verbose, runs, _:[url]} = argv;
  const test = local ? localTest : apiTest;

  const results = [];
  verbose && console.log('score\tFCP\tFMP\tSI\tFCI\tTTI\tbenchmarkIndex\tfetchTime')
  for (let runsLeft = runs; runsLeft > 0; runsLeft--) {
    const result = getMetrics(await test(url));
    verbose && console.log(result.join('\t'));
    results.push(result);
  }

  console.log(median(results.map(([score, ...rest]) => score)))
}
