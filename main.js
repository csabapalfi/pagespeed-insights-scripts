import {median} from 'simple-statistics';
import test from './api';
import mapResult, {tableHeading, tableRow} from './map-result';
import yargs from 'yargs';

export async function main() {
  const argv = yargs
    .boolean('table')
    .alias('v', 'table')
    .boolean('jsonl')
    .default('warmupRuns', 0)
    .default('userTimingMarks', {})
    .default('runs', 9)
    .argv;

  const {table, jsonl, warmupRuns, userTimingMarks, runs, _:[url]} = argv;

  table && console.log(tableHeading(userTimingMarks).join('\t'));
  
  const results = [];

  for (let runsLeft = warmupRuns + runs; runsLeft > 0; runsLeft--) {
    const result = mapResult(await test(url), userTimingMarks);
    const warmupRun = runsLeft > runs;
    table && console.log(tableRow(result, warmupRun).join('\t'));
    jsonl && console.log(JSON.stringify(result)); 
    
    if (!warmupRun) {
      results.push(result);
    }
  }

  if (!table && !jsonl) {
    console.log(median(results.map(({score}) => score)));
  }
}
