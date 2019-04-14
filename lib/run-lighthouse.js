const {launch} = require('chrome-launcher');

const config = {
  extends: 
    'node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'first-cpu-idle',
      'interactive',
      'time-to-first-byte'
    ]
  }
};

async function runLighthouse({modulePath, cpuSlowDown}, url) {
  const lighthouse = require(modulePath);
  const throttling = {cpuSlowdownMultiplier: cpuSlowDown};

  const chrome = await launch({chromeFlags: ['--headless']});

  const options = {port: chrome.port, throttling};
  const {lhr: result} = await lighthouse(url, options, config);

  await chrome.kill();

  return result;
}

module.exports = {runLighthouse, config};

