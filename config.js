module.exports = {
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
      cpuSlowdownMultiplier: 3
    }
  }
};