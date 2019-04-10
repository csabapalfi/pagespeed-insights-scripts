import {parse, format} from 'date-fns';
import {median, min, max, sampleStandardDeviation} from 'simple-statistics';
const {round} = Math;
const {entries} = Object;

export const METRICS = {
  TTFB: 'time-to-first-byte',
  FCP: 'first-contentful-paint',
  FMP: 'first-meaningful-paint',
  SI: 'speed-index',
  FCI: 'first-cpu-idle',
  TTI: 'interactive'
};

function formatTime(value) {
  return format(parse(value), 'HH:mm:ss');
}

function formatScore(value, warmupRun) {
  return round(value * 100)
}

function formatMs(value) {
  return (value / 1000).toFixed(2)
}

function mapAudits(audits, namesByKey, mapping) {
  const merge = (a, b) => ({...a, ...b});
  return entries(namesByKey).map(([key, name]) => ({
    [key]: mapping(audits, name) 
  })).reduce(merge, {});
}

function mapMetricValue(audits, name) {
  const displayValue = audits[name].displayValue;
  const number = parseFloat(displayValue.replace(/[^0-9-.]/g, ''));
  return displayValue.includes('ms') ? formatMs(number) : number.toFixed(1);
}

function mapUserTimingMarkValue(audits, name) {
  const mark = audits['user-timings'].details.items
    .find(item => item.name === name);
  return mark ? formatMs(mark.startTime) : NaN;
}

export default function mapResult(result, userTimingMarks, warmupRun) {
  const {fetchTime, categories, environment, audits} = result;
  return {
    warmupRun,
    fetchTime: formatTime(fetchTime),
    score: formatScore(categories.performance.score),
    benchmarkIndex: environment.benchmarkIndex,
    metrics: mapAudits(audits, METRICS, mapMetricValue),
    userTimingMarks: mapAudits(audits, userTimingMarks, mapUserTimingMarkValue)
  }
}

export function tableHeading(userTimingMarks) {
  return [
    'fetchTime', 'score', 
    ...Object.keys(METRICS),
    ...Object.keys(userTimingMarks),
    'benchmark'
  ]
}

export function tableRow({
  warmupRun, fetchTime, score, benchmarkIndex, metrics, userTimingMarks
}) {
  return [
    fetchTime,
    warmupRun ? `(${score})` : score, 
    ...Object.values(metrics), 
    ...Object.values(userTimingMarks),
    benchmarkIndex
  ];
}

function statRow({
  name, score, benchmarkIndex, metrics = {}, userTimingMarks = {}
}) {
  return [
    name,
    score,
    ...Object.values(metrics),
    ...Object.values(userTimingMarks),
    benchmarkIndex
  ];
}

const STATS = {
  'Median  ': median,
  'Std Dev ': sampleStandardDeviation,
  'Minimum ': min,
  'Maximum ': max,
}

export function statsRows(results, MARKS) {
  return entries(STATS).map(([name, getValue]) => statRow({
    name,
    score: getValue(results.map(({score}) => score)).toFixed(1),
    metrics: Object.keys(METRICS).map(key => {
      return getValue(results.map(({metrics}) => parseFloat(metrics[key]))).toFixed(1)
    }),
    userTimingMarks: Object.keys(MARKS).map(key => {
      return getValue(results.map(({userTimingMarks}) => parseFloat(userTimingMarks[key]))).toFixed(1)
    }),
    benchmarkIndex: getValue(results.map(({benchmarkIndex}) => benchmarkIndex)).toFixed(1),
  }));
}




