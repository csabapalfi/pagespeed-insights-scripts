const {runPagespeed} = require('./run-pagespeed');
const {runLighthouse} = require('./run-lighthouse');
const {assetSaver} = require('./save-assets');
const {resultMapper} = require('./map-result');

class Fetcher {
  constructor(url, metrics, lighthouse, saveAssets) {
    this.mapResult = resultMapper(metrics);
    this.getLighthouseResult = lighthouse.enabled ? 
      runLighthouse.bind(null, lighthouse, url) :
      runPagespeed.bind(null, url);
    if (saveAssets) {
      this.saveAssets = assetSaver(lighthouse.modulePath);
    }
  }

  async getResult() {
    const {result, artifacts} = await this.getLighthouseResult();
    if (this.saveAssets) {
      await this.saveAssets(result, artifacts);
    }
    return this.mapResult(result);
  }
}

module.exports = {Fetcher};

