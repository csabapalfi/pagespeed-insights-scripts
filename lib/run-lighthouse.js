const {launch} = require('chrome-launcher');
const lighthouse = require('lighthouse');

const config = {
  extends: 
    `lighthouse/lighthouse-core/config/lr-mobile-config.js`,
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'first-cpu-idle',
      'interactive',
    ]
  }
}

module.exports = async ({cpuSlowDown}, url) => {
  const throttling = {cpuSlowdownMultiplier: cpuSlowDown};

  const chrome = await launch({chromeFlags: ['--headless']});

  const options = {port: chrome.port, throttling};
  const {lhr: result, artifacts} = await lighthouse(url, options, config);

  await chrome.kill();

  return {result, artifacts};
}
