const {resolve} = require('path');
const {writeFileSync} = require('fs');

function assetSaver(lighthouseModulePath) {
  const {getFilenamePrefix} = 
    require(`${lighthouseModulePath}/lighthouse-core/lib/file-namer`);
  const {saveAssets} = 
    require(`${lighthouseModulePath}/lighthouse-core/lib/asset-saver`);

  return async (result, artifacts) => {
    const resolvedPath = resolve(process.cwd(), getFilenamePrefix(result));
    const report = JSON.stringify(result, null, 2);
    writeFileSync(resolvedPath + '.report.json', report, 'utf-8');

    if (artifacts) {
      await saveAssets(artifacts, result.audits, resolvedPath);
    }
  }
}

module.exports = {assetSaver};