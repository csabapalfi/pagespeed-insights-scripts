#!/usr/bin/env node

const {main} = require('./lib/main.js');
const {parseArgs} = require('./lib/cli-options.js');

const options = parseArgs(process.argv);

(async() => {
  for await (const lines of main(options)) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();


