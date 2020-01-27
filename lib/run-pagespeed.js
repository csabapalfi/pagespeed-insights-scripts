const wreck = require('wreck');

const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

module.exports = async (urlString, strategy) => {
    const url = new URL(urlString);
    if(!url.hash) {
      // bust PSI cache but not your CDN's cache
      url.hash = `#${Date.now().toString().substring(6)}`
    }
    const queryOptions = {
      url: url.toString(),
      strategy: strategy || 'mobile',
    }
    const query = new URLSearchParams(queryOptions)
    const apiUrl = `${baseUrl}/?${query.toString()}`;
    const {payload} = await wreck.get(apiUrl, {json: true});
    return {result: payload.lighthouseResult};
}
