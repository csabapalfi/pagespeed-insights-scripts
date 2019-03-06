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

const metrics = [
  'first-contentful-paint',
  'first-meaningful-paint',
  'speed-index',
  'interactive',
  'first-cpu-idle'
];

const opts = {
  chromeFlags: ['--headless']
};

const getConfig = (onlyAudits, cpuSlowdownMultiplier = 1) => ({
  extends: 'node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js',
  settings: {
    onlyAudits,
    throttling: {cpuSlowdownMultiplier}
  }
});

function formatScore(score) {
  return Math.round(score * 100);
}

async function calibrateCpu(url = 'http://www.example.com') {
  const config = getConfig(metrics[0]);
  const calibrationResult = await runLighthouse(url, opts, config);

  const benchmarkIndex = calibrationResult.environment.benchmarkIndex;
  const cpuSlowdownMultiplier = benchmarkIndex / 500;
  debug('calibration')({ benchmarkIndex, cpuSlowdownMultiplier });

  return cpuSlowdownMultiplier;
}

async function getPageSpeedScore(url, options = {}) {
  const cpuSlowdownMultiplier =
    options.cpuSlowdownMultiplier || await calibrateCpu();
  const config = getConfig(metrics, cpuSlowdownMultiplier);
  
  const result = await runLighthouse(url, opts, config);

  debug('result')(result);
  Object.values(result.audits).forEach(({id, displayValue, score}) => 
    debug('metrics')(`${id}: ${displayValue} (${formatScore(score)})`)
  );

  return formatScore(result.categories.performance.score);
}

if (require.main === module) {
  (async() => {
    const [,,url] = process.argv;
    console.log(await getPageSpeedScore(url))
  })();
} else {
  module.exports = {
    calibrateCpu,
    getPageSpeedScore
  };
}
