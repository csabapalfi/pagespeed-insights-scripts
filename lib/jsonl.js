function format(entries) {
  return entries.map(JSON.stringify);
}

module.exports = {format};