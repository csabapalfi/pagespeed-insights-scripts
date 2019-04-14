#!/usr/bin/env node

const {parseArgs} = require('./lib/cli-options.js');
const {main} = require('./lib/main.js');

const {argv} = process;

(async() => {
  for await (const lines of main(parseArgs({argv}))) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();
