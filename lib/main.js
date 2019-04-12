/* eslint-disable no-console */
import getOptions from './cli-options';
import runPageSpeed from './run-psi';
import mapResult from './map-result';
import {tableHeading, tableRow} from './tsv';
import getStats from './stats';

export async function main(
  {url, runs, warmupRuns, additionalMetrics, output} = getOptions(),
  getLightHouseResult = runPageSpeed
) {
  const results = [];

  for (let runsLeft = warmupRuns + runs; runsLeft > 0; runsLeft--) {
    const firstRun = runsLeft === warmupRuns + runs;
    const warmup = runsLeft > runs;
    const lightHouseResult = await getLightHouseResult(url);
    const result = mapResult(lightHouseResult, additionalMetrics, warmup);

    if (output.jsonl) {
      console.log(JSON.stringify(result));
    } else {
      firstRun && console.log(tableHeading(result));
      console.log(tableRow(result));
    }
    
    if (!warmup) {
      results.push(result);
    }
  }

  if (output.stats && runs > 1) {
    const statistics = getStats(results);

    if (output.jsonl) {
      statistics.forEach(statistic => console.log(JSON.stringify(statistic)));
    } else {
      console.log();
      statistics.forEach(statistic => console.log(tableRow(statistic)));
    }
  }
}
