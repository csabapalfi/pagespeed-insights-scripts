const chalk = require('chalk');

const {keys, entries} = Object;

const color = (score) => {
  if (score < 50) {
    return 'red'
  }
  if (score < 90) {
    return 'yellow'
  }
  return 'green'
}

const precision = (digits) => (n, score) => score ? 
  chalk[color(score)](n.toFixed(digits)) : n.toFixed(digits)

const formats = {
  name: s => s.padEnd(6),
  score: precision(0),
  score_stddev: precision(1),
  FCP: precision(1),
  SI: precision(1),
  LCP: precision(1),
  TTI: precision(1),
  TBT: precision(1),
  CLS: precision(2),
  default: precision(2),
};

function formatHeading(result) {
  return keys(result)
    .filter((k) => !k.endsWith('_score'))
    .map((k, index) => index === 0 ? k.padEnd(6) : k)
    .join('\t');
}

function formatRow(result) {
  return entries(result)
    .filter(([k]) => !k.endsWith('_score'))
    .map(
      ([k, v]) => (
        formats[`${k}_${result.name}`] ||
        formats[k] || 
        formats.default
      )(v, k === 'score' ? v : result.name !=='stdev' ? result[`${k}_score`] : '') // TODO, OMG clean this up
    )
    .join('\t');
}

module.exports = {
  formatHeading, 
  formatRow
};
