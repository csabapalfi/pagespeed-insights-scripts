#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const debug = require('debug');

async function runLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const METRICS = [
  'first-contentful-paint',
  'first-meaningful-paint',
  'speed-index',
  'interactive',
  'first-cpu-idle'
];

const getOptions = (cpuSlowdownMultiplier = 1) => ({
  chromeFlags: ['--headless'],
  blockedUrlPatterns: [],
  throttling: {cpuSlowdownMultiplier}
});

const getConfig = (onlyAudits = []) => ({
  extends: 'node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js',
  settings: {onlyAudits}
});

function formatScore(score) {
  return Math.round(score * 100);
}

async function calibrateCpu(url = 'http://www.example.com') {
  const opts = getOptions();
  const config = getConfig();
  //TODO calibrate without a separate run
  const calibrationResult = await runLighthouse(url, opts, config);

  const benchmarkIndex = calibrationResult.environment.benchmarkIndex;
  const cpuSlowdownMultiplier = benchmarkIndex / 600;
  debug('pagespeed:calibration')({ benchmarkIndex, cpuSlowdownMultiplier });

  return cpuSlowdownMultiplier;
}

async function getPageSpeedScore(url, options = {}) {
  const cpuSlowdownMultiplier =
    options.cpuSlowdownMultiplier || await calibrateCpu();
  const opts = getOptions(cpuSlowdownMultiplier);
  const config = getConfig(METRICS);
  
  const lighthouseResult = await runLighthouse(url, opts, config);
  const metrics = Object.values(lighthouseResult.audits)
    .map(({id, displayValue, rawValue, score}) => 
      ({id, displayValue, rawValue, score}));

  metrics.forEach(({id, displayValue, score}) =>
    debug('pagespeed:metrics')(`${id}: ${displayValue} (${formatScore(score)})`)
  );

  const score = formatScore(lighthouseResult.categories.performance.score);
  debug('pagespeed:score')(score);

  const result = {score};
  if (options.metrics) {
    result.metrics = metrics;
  }
  if (options.result) {
    result.lighthouseResult = lighthouseResult;
  }

  return result;
}

function median(values = []) {
  values.sort((a,b) => a - b);

  const length = values.length;
  const half = Math.floor(length / 2);

  if (length === 0) {
    return 0;
  }

  return length % 2 ?
    values[half] :
    Math.round((values[half - 1] + values[half]) / 2.0);
}

if (require.main === module) {
  (async() => {
    let [,,url, runs = 3] = process.argv;
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    const scores = [];
    for (runs; runs > 0; runs--) {
      const {score} = await getPageSpeedScore(url);
      scores.push(score);
    }

    console.log(median(scores));
  })();
} else {
  module.exports = {
    calibrateCpu,
    getPageSpeedScore
  };
}
