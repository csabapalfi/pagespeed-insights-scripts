const {round} = Math;
const {entries} = Object;

const DEFAULT_METRICS = {
  FCP: 'first-contentful-paint',
  FMP: 'first-meaningful-paint',
  SI: 'speed-index',
  FCI: 'first-cpu-idle',
  TTI: 'interactive',
};

function formatScore(value) {
  return parseInt(round(value * 100), 10);
}

function formatSec(value) {
  return parseFloat(parseFloat(value).toFixed(1));
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
  return formatSec(audit.displayValue);
}

module.exports = (index, {categories, audits}) => ({
  name: `run ${index}`,
  score: formatScore(categories.performance.score),
  ...mapAudits(audits, DEFAULT_METRICS, mapMetricValue),
});