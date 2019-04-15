const {launch} = require('chrome-launcher');

const getConfig = (modulePath) => ({
  extends: 
    `${modulePath}/lighthouse-core/config/lr-mobile-config.js`,
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'first-cpu-idle',
      'interactive',
      'time-to-first-byte',
      'user-timings'
    ]
  }
});

async function runLighthouse({modulePath, cpuSlowDown}, url) {
  const lighthouse = require(modulePath);
  const throttling = {cpuSlowdownMultiplier: cpuSlowDown};

  const chrome = await launch({chromeFlags: ['--headless']});

  const options = {port: chrome.port, throttling};
  const config = getConfig(modulePath);
  const {lhr: result, artifacts} = await lighthouse(url, options, config);

  await chrome.kill();

  return {result, artifacts};
}

module.exports = {runLighthouse};

