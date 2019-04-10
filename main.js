import getOptions from './cli-options';
import test from './api';
import {median} from 'simple-statistics';
import mapResult, {tableHeading, tableRow} from './map-result';

export async function main({
  url, runs, warmupRuns, stats, tsv, jsonl, userTimingMarks
} = getOptions()) {
  tsv && console.log(tableHeading(userTimingMarks).join('\t'));
  
  const results = [];

  for (let runsLeft = warmupRuns + runs; runsLeft > 0; runsLeft--) {
    const warmupRun = runsLeft > runs;
    const result = mapResult(await test(url), userTimingMarks, warmupRun);

    tsv && console.log(tableRow(result).join('\t'));
    jsonl && console.log(JSON.stringify(result));
    
    if (!warmupRun) {
      results.push(result);
    }
  }

  if (stats) {
    const medianScore = median(results.map(({score}) => score));
    console.log(`Median ${medianScore}`);
  }
}
