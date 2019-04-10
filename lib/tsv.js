const {keys, entries} = Object;

const identity = (x) => x;
const precision = (digits) => (n) => n.toFixed(digits);

const skip = ['type', 'warmup'];

const formats = {
  fetchTime: identity,
  name: s => s.padEnd(8),
  score: precision(0),
  score_stddev: precision(1),
  FCP: precision(1),
  FMP: precision(1),
  SI: precision(1),
  FCI: precision(1),
  TTI: precision(1),
  TTFB: precision(2),
  benchmark: precision(0),
  default: precision(2)
};

export function tableHeading(result) {
  return keys(result).filter(k => !skip.includes(k)).join('\t');
}

export function tableRow(result) {
  return entries(result)
    .filter(([k]) => !skip.includes(k))
    .map(
      ([k, v]) => (
        formats[`${k}_${result.name}`] || 
        formats[k] || 
        formats.default
      )(v)
    )
    .join('\t');
}



