# pagespeed-score

Get a Google PageSpeed Insights (PSI) score by running Lighthouse locally.

## Command Line

```sh
# pagespeed-score <url> <number-of-runs>
$ npx pagespeed-score www.google.com 5
100 # median pagespeed score
```

## Module

```js
const {getPageSpeedScore} = require('pagespeed-score');

const result = getPageSpeedScore('https://www.google.com', {
  // optional, default: calibrated, CPU throttling
  cpuSlowdownMultiplier: 2,

  // optional, default: false, return metrics
  metrics: true,

  // optional, default: false, return complete Lighthouse result
  result: true
});

const {
  // Performance score, always returned
  score,

  // The metrics that are used to calculate performance score
  // (only returned if options.metrics=true)
  metrics,


  // Full Lighthouse results
  // (only returned if options.result=true)
  lighthouseResult
} = result;
```

## Why?

The goal is to get a PSI score:

* in CI and without public URL (e.g. staging environment on a private network)
* faster (the Google API takes seconds to respond)
* more stable (i.e. less noise) to allow comparison tests

## How

* using the same version of LightHouse as PSI
* using [LightRider mobile config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js) from the `lighthouse` module
* calibrating CPU throttling using benchmark index (based on the typical LightRider benchmark index of 600)
* faster run by only getting metrics needed for the performance score
* doing multiple runs and taking the median

## Ideas/TODO

* output multiple run details (as csv?, maybe JSON)
* get more data on LightRider benchmarkIndex variance
* throw error if benchmarkIndex lower than calibration target (600)
* support blocking URLs (great for comparison tests, i.e. quantifying impact of certain resources)
* calibrate CPU throttling without doing a separate run first
* support more options (available via the module) in cli
* support multiple runs when using module
* maybe support all Lighthouse cli options?