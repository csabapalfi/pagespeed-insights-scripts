const {round} = Math;
const {entries} = Object;

const DEFAULT_METRICS = {
  FCP: 'first-contentful-paint',
  SI: 'speed-index',
  LCP: 'largest-contentful-paint',
  TTI: 'interactive',
  TBT: 'total-blocking-time',
  CLS: 'cumulative-layout-shift',
};

function formatScore(value) {
  return parseInt(round(value * 100), 10);
}

function formatSec(value) {
  return parseFloat(parseFloat(value / 1000).toFixed(2));
}

function getAuditValue(audits, name) {
  return audits[name];
}

function mapAudits(audits, namesByKey, mapValue) {
  const merge = (a, b) => ({...a, ...b});
  return entries(namesByKey)
    .filter(([, name]) => getAuditValue(audits, name))
    .map(([key, name]) => ({
      [key]: mapValue(getAuditValue(audits, name))
    }))
    .reduce(merge, {});
}

function mapMetricValue(audit) {
  return formatSec(audit.numericValue);
}

module.exports = (index, {categories, audits}) => ({
  name: `run ${index}`,
  score: formatScore(categories.performance.score),
  ...mapAudits(audits, DEFAULT_METRICS, mapMetricValue),
});