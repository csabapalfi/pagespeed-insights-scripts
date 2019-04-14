const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {getFilenamePrefix} = require('lighthouse/lighthouse-core/lib/file-namer');
const assetSaver = require('lighthouse/lighthouse-core/lib/asset-saver');

async function saveAssets(result, artifacts) {
  const resolvedPath = resolve(process.cwd(), getFilenamePrefix(result));
  const report = JSON.stringify(result, null, 2);

  writeFileSync(resolvedPath + '-0.report.json', report, 'utf-8');

  if (artifacts) {
    await assetSaver.saveAssets(artifacts, result.audits, resolvedPath);
  }
}

module.exports = {saveAssets};