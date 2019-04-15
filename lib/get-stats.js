const {median, sampleStandardDeviation, min, max} = 
  require('simple-statistics');

const {keys, entries} = Object;

const noStats = ['type', 'name'];

const statistics = {
  'median': median,
  'stddev': sampleStandardDeviation,
  'min': min,
  'max': max,
}

function getStats(samples) {
  const merge = (a, b) => ({...a, ...b});
  const metricNames = keys(samples[0])
    .filter(metricName => !noStats.includes(metricName));

  return entries(statistics).map(([statisticName, statisticFn]) => 
    metricNames.map(metricName => {
        const metricSamples = samples.map(sample => sample[metricName]);
        return ({[metricName]: statisticFn(metricSamples)})
      })
      .reduce(merge, {type: 'statistic', name: statisticName})
  );
}

module.exports = {getStats};