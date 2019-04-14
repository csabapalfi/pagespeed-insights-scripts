const {resolve} = require('path');
const {writeFileSync} = require('fs');
const getFilenamePrefix = require('lighthouse/lighthouse-core/lib/file-namer').getFilenamePrefix;
const assetSaver = require('lighthouse/lighthouse-core/lib/asset-saver');

async function saveAssets(result, artifacts) {
  const resolvedPath = resolve(process.cwd(), getFilenamePrefix(result));
  writeFileSync(resolvedPath + '.report.json', JSON.stringify(result, null, 2), 'utf-8');
  if (artifacts) {
    await assetSaver.saveAssets(artifacts, result.audits, resolvedPath);
  }
}

module.exports = {saveAssets};