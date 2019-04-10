import {median} from 'simple-statistics';
import test from './api';
import mapResult, {tableHeading, tableRow} from './map-result';
import yargs from 'yargs';

export async function main() {
  const argv = yargs
    .boolean('v')
    .default('warmupRuns', 0)
    .default('userTimingMarks', {})
    .default('runs', 9)
    .argv;

  const {v: verbose, warmupRuns, userTimingMarks, runs, _:[url]} = argv;

  verbose && console.log('\n' + tableHeading(userTimingMarks).join('\t'));
  
  const results = [];

  for (let runsLeft = warmupRuns + runs; runsLeft > 0; runsLeft--) {
    const result = mapResult(await test(url), userTimingMarks);
    const warmupRun = runsLeft > runs;
    verbose && console.log(tableRow(result, warmupRun).join('\t'));
    
    if (!warmupRun) {
      results.push(result);
    }
  }
  verbose && console.log('\n');
  console.log(median(results.map(({score}) => score)));
}
