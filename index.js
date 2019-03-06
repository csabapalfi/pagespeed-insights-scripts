const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const opts = {
  chromeFlags: ['--headless']
};

const config = {
  extends: 'node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'interactive',
      'first-cpu-idle'
    ],
    throttling: {
      // TODO calibrate/adjust this based on benchmarkIndex
      cpuSlowdownMultiplier: 3
    }
  }
};

(async() => {
  const [,,url] = process.argv;
  const result = await launchChromeAndRunLighthouse(url, opts, config);
  const score = Math.round(result.categories.performance.score * 100);
  console.log(score);
})();
