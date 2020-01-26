const {runPagespeed} = require('./run-pagespeed');
const {runLighthouse} = require('./run-lighthouse');
const {assetSaver} = require('./save-assets');
const {resultMapper} = require('./map-result');

class Fetcher {
  constructor(url, lighthouse, strategy, output) {
    this.mapResult = resultMapper();
    this.getLighthouseResult = lighthouse.enabled ? 
      runLighthouse.bind(null, lighthouse, url) :
      runPagespeed.bind(null, url, strategy);
    if (output.saveAssets) {
      this.saveAssets = assetSaver(output);
    }
  }

  async getResult(index) {
    const {result, artifacts} = await this.getLighthouseResult();
    if (this.saveAssets) {
      await this.saveAssets(index, result, artifacts);
    }
    return this.mapResult(index, result);
  }
}

module.exports = {Fetcher};

