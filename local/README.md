# pagespeed-score/local

Get a Google PageSpeed Insights (PSI) score by running Lighthouse locally.

## Why?

The goal is to get a PSI score:

* in CI and without public URL (e.g. staging environment on a private network)
* more stable (i.e. less noise) to allow comparison tests
* faster if possible (the Google API takes long to respond)

## How

* using the same version of LightHouse as PSI
* using [LightRider mobile config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js) from the `lighthouse` module
* ~~calibrating CPU throttling using benchmark index (based on the typical LightRider benchmark index of 600)~~ - should revisit this
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
* maybe support all Lighthouse cli optionsfrom `lighthouse-cli/cli-flags.js`?