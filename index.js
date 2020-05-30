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
  while (run < runs) {
    run++;

    const {result, artifacts} = await (
      local.enabled ?
        runLighthouse(local, url) :
        runPagespeed(url, strategy)
    );

    await saveFiles(run, saveResults, local, result, artifacts);

    yield sampleResult(run, result);
  }

}

if (require.main === module) {
  const {argv} = process;
  const options = parseArgs({argv});
  const samples = [];

  (async () => {
    for await (const sample of main(options)) {
      samples.push(sample);

      if(samples.length === 1) {
        console.log(formatHeading(sample))
      }

      console.log(formatRow(sample))
    }

    if (samples.length > 1) {
      ['', ...stats(samples).map(formatRow)]
        .forEach(line => console.log(line));
    }

  })();
}

module.exports = main;
