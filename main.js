import {median} from 'simple-statistics';
import apiTest from './api';
import localTest from './local';
import getMetrics from './metrics';
import yargs from 'yargs';

export async function main() {
  const argv = yargs
    .boolean('local')
    .default('runs', 9)
    .argv;
  const {local, runs, _:[url]} = argv;
  const test = local ? localTest : apiTest;

  const results = [];
  console.log('score,FCP,FMP,SI,FCI,TTI,benchmarkIndex,fetchTime')
  for (let runsLeft = runs; runsLeft > 0; runsLeft--) {
    const result = getMetrics(await test(url));
    console.log(result.join(','));
    results.push(result);
  }

  console.log(median(results.map(([score, ...rest]) => score)))
}
