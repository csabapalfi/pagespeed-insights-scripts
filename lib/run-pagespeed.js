const wreck = require('wreck');

const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

async function runPagespeed(urlString) {
    const url = new URL(urlString);
    url.searchParams.append('pagespeed-nocache', Date.now());
    const query = new URLSearchParams({url: url.toString(), strategy: 'mobile'});
    const apiUrl = `${baseUrl}/?${query.toString()}`;
    const {payload} = await wreck.get(apiUrl, {json: true});
    return {result: payload.lighthouseResult};
}

module.exports = {runPagespeed};