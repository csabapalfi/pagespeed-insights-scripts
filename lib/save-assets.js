const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {saveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');

function assetSaver(output) {
  return async (index, result, artifacts) => {
    const resolvedPath = resolve(process.cwd(), `${output.filePrefix}${index}`);
    const report = JSON.stringify(result, null, 2);
    writeFileSync(`${resolvedPath}-0.report.json`, report, 'utf-8');

    if (artifacts) {
      if (output.lanternDebug) {
        process.env.LANTERN_DEBUG="true";
      }
      await saveAssets(artifacts, result.audits, resolvedPath);
    }
  }
}

module.exports = {assetSaver};