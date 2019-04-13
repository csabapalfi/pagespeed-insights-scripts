const {parse, format} = require('date-fns');
const {round} = Math;
const {entries} = Object;

const scoreMetrics = {
  FCP: 'first-contentful-paint',
  FMP: 'first-meaningful-paint',
  SI: 'speed-index',
  FCI: 'first-cpu-idle',
  TTI: 'interactive'
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

function mapAudits(audits, namesByKey, mapping) {
  const merge = (a, b) => ({...a, ...b});
  return entries(namesByKey).map(([key, name]) => ({
    [key]: mapping(audits, name) 
  })).reduce(merge, {});
}

function mapMetricValue(audits, name) {
  return formatSec(audits[name].displayValue);
}

function mapTTFB(audits) {
  const audit = audits['time-to-first-byte'];
  return formatMs(audit.displayValue.match(/\d+/)[0]);
}

function mapUserTimingMarkValue(audits, name) {
  const audit = audits['user-timings'];
  const mark = audit.details.items.find(item => item.name === name);
  const value = mark ? mark.startTime : NaN;
  return formatMs(value);
}

function mapResult(result, additionalMetrics, warmup) {
  const {userTimingMarks, ttfb, benchmark} = additionalMetrics;
  const {fetchTime, categories, environment, audits} = result;
 
  return {
    type: 'result',
    ...warmup && {warmup},
    fetchTime: formatTime(fetchTime),
    score: formatScore(categories.performance.score),
    ...mapAudits(audits, scoreMetrics, mapMetricValue),
    ...ttfb && {TTFB: mapTTFB(audits)},
    ...mapAudits(audits, userTimingMarks, mapUserTimingMarkValue),
    ...benchmark && {benchmark: environment.benchmarkIndex},
  }
}

module.exports = {mapResult};