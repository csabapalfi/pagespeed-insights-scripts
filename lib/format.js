const {keys, entries} = Object;

const precision = (digits) => (n) => n.toFixed(digits);

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
    .map((k, index) => index === 0 ? k.padEnd(6) : k)
    .join('\t');
}

function formatRow(result) {
  return entries(result)
    .map(
      ([k, v]) => (
        formats[`${k}_${result.name}`] || 
        formats[k] || 
        formats.default
      )(v)
    )
    .join('\t');
}

module.exports = {
  formatHeading, 
  formatRow
};
