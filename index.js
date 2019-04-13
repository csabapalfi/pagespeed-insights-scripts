#!/usr/bin/env node

const {main} = require('./lib/main.js');
const {parseArgs} = require('./lib/cli-options.js');

(async() => {
  for await (const lines of main(parseArgs(process.argv))) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();
