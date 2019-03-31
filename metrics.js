export const AUDITS = [
  'first-contentful-paint',
  'first-meaningful-paint',
  'speed-index',
  'first-cpu-idle',
  'interactive'
];

function getValue({rawValue, displayValue}) {
  if (rawValue) {
    return (rawValue / 1000).toFixed(1);
  }
  return parseFloat(displayValue.replace(' s', '')).toFixed(1);
}

export default function getMetrics(result) {
  const fetchTime = result.fetchTime;
  const score = Math.round(result.categories.performance.score * 100);
  const metrics = AUDITS.map(audit =>
    getValue(result.audits[audit])
  )
  const benchmarkIndex = result.environment.benchmarkIndex;
  return [score, ...metrics, benchmarkIndex, fetchTime];
}

