import {median, sampleStandardDeviation, min, max} from 'simple-statistics';
const {keys, entries} = Object;

const noStats = ['type', 'warmup', 'fetchTime'];

const stats = {
  'median': median,
  'stddev': sampleStandardDeviation,
  'min': min,
  'max': max,
}

export default function getStats(results) {
  const merge = (a, b) => ({...a, ...b});
  const metrics = keys(results[0]).filter(key => !noStats.includes(key));

  return entries(stats).map(([name, fn]) => metrics
      .map(metric => ({[metric]: fn(results.map(result => result[metric]))}))
      .reduce(merge, {type: 'statistic', name})
  );
}