const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {saveAssets: lhSaveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');

async function saveAssets(index, result, artifacts) {
  const resolvedPath = resolve(process.cwd(), index);
  const report = JSON.stringify(result, null, 2);
  writeFileSync(`${resolvedPath}-0.report.json`, report, 'utf-8');

  if (artifacts) {
    await lhSaveAssets(artifacts, result.audits, resolvedPath);
  }
}

module.exports = {saveAssets};