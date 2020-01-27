#!/usr/bin/env node

const {parseArgs} = require('./lib/parse-args');
const runPagespeed = require('./lib/run-pagespeed');
const runLighthouse = require('./lib/run-lighthouse');
const saveFiles = require('./lib/save-files');
const sampleResult = require('./lib/sample-result');
const {formatHeading, formatRow} = require('./lib/format');
const stats = require('./lib/stats');

async function* main({url, runs, saveResults, strategy, local}) {
  let run = 0;
  const samples = [];
  while (run < runs) {
    run++;

    const {result, artifacts} = await (
      local.enabled ? 
        runLighthouse(local, url) :
        runPagespeed(url, strategy)
    );

    await saveFiles(run, saveResults, local, result, artifacts);

    const sample = sampleResult(run, result);
    samples.push(sample);

    if (run === 1) {
      yield [formatHeading(sample)];
    }

    yield [formatRow(sample)];

    if (run === runs && samples.length > 1) {
      yield ['', ...stats(samples).map(formatRow)];
    }
  }

}

if (require.main === module) {
  const {argv} = process;

  (async () => {
    for await (const lines of main(parseArgs({argv}))) {
      /* eslint-disable-next-line no-console */
      lines.forEach(line => console.log(line));
    }
  })();
}

module.exports = main;
