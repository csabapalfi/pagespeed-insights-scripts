import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {AUDITS} from '../metrics';

const getOptions = (cpuSlowdownMultiplier = 4) => ({
  saveAssets: true,
  chromeFlags: ['--headless'],
  blockedUrlPatterns: [],
  throttling: {cpuSlowdownMultiplier}
});

const getConfig = (onlyAudits = AUDITS) => ({
  extends: 'node_modules/lighthouse/lighthouse-core/config/lr-mobile-config.js',
  settings: {onlyAudits}
});

export default async function test(
  url, 
  config = getConfig(), 
  {chromeFlags, ...options} = getOptions(),
) {
  const chrome = await launch({chromeFlags});
  const {lhr: result} = 
  await lighthouse(url, {port: chrome.port, ...options}, config);
  await chrome.kill();
  return result;
}

if (require.main === module) {
  (async() => {
    let [,,url] = process.argv;
    const res = await test(url);
    console.log(res);
  })();
}
