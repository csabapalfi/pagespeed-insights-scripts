import {URL, URLSearchParams} from 'url';
import wreck from 'wreck';

const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export default async function runPagespeed(urlString) {
    const url = new URL(urlString);
    url.searchParams.append('pagespeed-nocache', Date.now());
    const query = new URLSearchParams({url: url.toString(), strategy: 'mobile'});
    const apiUrl = `${baseUrl}/?${query.toString()}`;
    const {payload} = await wreck.get(apiUrl, {json: true});
    return payload.lighthouseResult;
};

if (require.main === module) {
  (async() => {
    let [,,url] = process.argv;
    const res = await test(url);
    console.log(res);
  })();
}