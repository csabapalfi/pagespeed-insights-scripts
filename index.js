#!/usr/bin/env node

const {parseArgs} = require('./lib/cli-options.js');
const {runPagespeed} = require('./lib/run-pagespeed');
const {runLighthouse} = require('./lib/run-lighthouse');
const {main} = require('./lib/main.js');

const {argv} = process;

(async() => {
  const {lighthouse, ...options} = parseArgs({argv});
  const getLighthouseResult = lighthouse.enabled ? 
    runLighthouse.bind(null, lighthouse) :
    runPagespeed;

  for await (const lines of main({...options, getLighthouseResult})) {
    /* eslint-disable-next-line no-console */
    lines.forEach(line => console.log(line));
  }
})();
