#!/usr/bin/env node

const {parseArgs} = require('./lib/cli-options.js');
const {runPagespeed} = require('./lib/run-pagespeed');
const {main} = require('./lib/main.js');

const {argv} = process;

(async() => {
  const options = {
    ...parseArgs({argv}),
    getLighthouseResult: runPagespeed
  };

  for await (const lines of main(options)) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();
