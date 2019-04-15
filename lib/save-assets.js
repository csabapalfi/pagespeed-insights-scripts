const {resolve} = require('path');
const {writeFileSync} = require('fs');

function assetSaver(lighthouseModulePath, filePrefix) {
  const {saveAssets} = 
    require(`${lighthouseModulePath}/lighthouse-core/lib/asset-saver`);

  return async (index, result, artifacts) => {
    const resolvedPath = resolve(process.cwd(), `${filePrefix}${index}`);
    const report = JSON.stringify(result, null, 2);
    writeFileSync(`${resolvedPath}-0.report.json`, report, 'utf-8');

    if (artifacts) {
      await saveAssets(artifacts, result.audits, resolvedPath);
    }
  }
}

module.exports = {assetSaver};