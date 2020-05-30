const {round} = Math;
const {entries} = Object;

const METRICS = {
  FCP: 'first-contentful-paint',
  SI: 'speed-index',
  LCP: 'largest-contentful-paint',
  TTI: 'interactive',
  TBT: 'total-blocking-time',
  CLS: 'cumulative-layout-shift',
}

const merge = (a, b) => ({ ...a, ...b });

function percentageToScore(value) {
  return parseInt(round(value * 100), 10);
}

function millisecondsToSeconds(value) {
  return parseFloat(parseFloat(value / 1000).toFixed(2));
}

const mapAudits = (audits) => entries(METRICS)
  .filter(([, name]) => audits[name])
  .map(([key, name]) => ({
    [key]: key === 'CLS' ? audits[name].numericValue : millisecondsToSeconds(audits[name].numericValue),
    [`${key}_score`]: percentageToScore(audits[name].score),
  }))
  .reduce(merge, {});

module.exports = (index, {categories, audits}) => ({
  name: `run ${index}`,
  score: percentageToScore(categories.performance.score),
  ...mapAudits(audits),
});