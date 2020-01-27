const {promisify} = require('util');
const {resolve} = require('path');
const {writeFile} = require('fs');

const {saveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');

async function saveResult(pathWithBaseName, result) {
  await promisify(writeFile)(
    `${pathWithBaseName}-0.result.json`,
    JSON.stringify(result, null, 2),
    'utf-8'
  );
}

module.exports = async (run, saveResults, local, result, artifacts) => {
  const pathWithBaseName = resolve(process.cwd(), `${run}`);
  if (saveResults) {
    await saveResult(pathWithBaseName, result);
  }
  if (local.enabled && local.saveAssets) {
    await saveAssets(artifacts, result.audits, pathWithBaseName);
  }
}