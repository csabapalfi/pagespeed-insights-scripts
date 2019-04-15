const {parse, format} = require('date-fns');
const {round} = Math;
const {entries} = Object;

const DEFAULT_METRICS = {
  FCP: 'first-contentful-paint',
  FMP: 'first-meaningful-paint',
  SI: 'speed-index',
  FCI: 'first-cpu-idle',
  TTI: 'interactive',
};

const TTFB = {
  TTFB: 'time-to-first-byte',
};

function formatTime(value) {
  return format(parse(value), 'HH:mm:ss');
}

function formatScore(value) {
  return parseInt(round(value * 100), 10);
}

function formatMs(value) {
  return parseFloat((parseFloat(value) / 1000).toFixed(2));
}

function formatSec(value) {
  return parseFloat(parseFloat(value).toFixed(1));
}

function getAuditValue(audits, name) {
  return audits[name];
}

function getMarkValue(audits, name) {
  const audit = audits['user-timings'];
  return audit.details.items.find(item => item.name === name);
}

function mapAudits(audits, namesByKey, mapValue, getAudit = getAuditValue) {
  const merge = (a, b) => ({...a, ...b});
  return entries(namesByKey)
    .filter(([, name]) => getAudit(audits, name))
    .map(([key, name]) => ({
      [key]: mapValue(getAudit(audits, name))
    }))
    .reduce(merge, {});
}

function mapMetricValue(audit) {
  return formatSec(audit.displayValue);
}

function mapTTFB(audit) {
  return formatMs(audit.displayValue.match(/\d+/)[0]);
}

function mapMarkValue(mark) {
  const value = mark ? mark.startTime : NaN;
  return formatMs(value);
}

function resultMapper(metrics) {
  const {userTimingMarks, ttfb, benchmark} = metrics;
 
  return ({fetchTime, categories, environment, audits}) => ({
    type: 'result',
    fetchTime: formatTime(fetchTime),
    score: formatScore(categories.performance.score),
    ...mapAudits(audits, DEFAULT_METRICS, mapMetricValue),
    ...ttfb && mapAudits(audits, TTFB, mapTTFB),
    ...mapAudits(audits, userTimingMarks, mapMarkValue, getMarkValue),
    ...benchmark && {benchmark: environment.benchmarkIndex},
  });
}

module.exports = {resultMapper, mapMarkValue, mapTTFB};