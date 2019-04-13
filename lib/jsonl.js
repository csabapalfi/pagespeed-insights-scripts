const format = JSON.stringify;

function result(result) {
  return [format(result)];
}

function stats(statistics) {
  return statistics.map(format);
}

module.exports = {result, stats};