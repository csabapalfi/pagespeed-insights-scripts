#!/usr/bin/env node

const main = require('./main.js');
const {parseArgs} = require('./cli-options.js');
const {argv} = process;

(async () => {
  for await (const lines of main(parseArgs({argv}))) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();