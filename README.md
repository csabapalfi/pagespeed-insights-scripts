# pagespeed-score

[![Build Status](https://travis-ci.org/csabapalfi/pagespeed-score.svg?branch=master)](https://travis-ci.org/csabapalfi/pagespeed-score/)
[![Coverage Status](https://coveralls.io/repos/github/csabapalfi/pagespeed-score/badge.svg?2)](https://coveralls.io/github/csabapalfi/pagespeed-score)

Google PageSpeed score command line toolkit

Get a score and metrics via the Google PageSpeed Insights API or a local Lighthouse run.

  - [Recommendations for using the score and metrics values](#recommendations-for-using-the-score-and-metrics-values)
  - [Requirements](#requirements)
  - [Usage](#usage)
    - [`--strategy` - mobile or desktop](#--strategy---mobile-or-desktop)
    - [`--runs` - multiple runs](#--runs---multiple-runs)
    - [`--local` - local mode](#--local---local-mode)
    - [`LANTERN_DEBUG=true` - save metrics estimation traces](#lantern_debugtrue---save-metrics-estimation-traces)

## Recommendations for using the score and metrics values

Check out my blog post for more details: [What's in the Google PageSpeed score?](https://medium.com/expedia-group-tech/whats-in-the-google-pagespeed-score-a5fc93f91e91)

## Requirements

The pagespeed score CLI requires **node.js 10+** (because it relies on async iterators).

## Usage

`npx` is the quickest way to try:

```
$ npx pagespeed-score https://www.google.com
name  	score	FCP	FMP	SI	FCI	TTI
run 1 	96	1.2	1.2	1.2	3.3	3.7
```

FCP, FMP, SI, FCI, TTI are the values (in seconds) for the 5 metrics that affect the score.

Use `--help` see the list of all options.

### `--strategy` - mobile or desktop

`--strategy <mobile|desktop>` sets the lighthouse strategy (default: mobile)

```
$ npx pagespeed-score --strategy desktop --runs 3 https://www.google.com
name  	score	FCP	FMP	SI	FCI	TTI
run 1 	100	0.5	0.5	0.5	0.9	0.9
run 2 	100	0.5	0.5	0.5	0.8	0.9
run 3 	100	0.5	0.5	0.5	0.8	0.9

median	100	0.5	0.5	0.5	0.8	0.9
stddev	0.0	0.0	0.0	0.0	0.1	0.0
min   	100	0.5	0.5	0.5	0.8	0.9
max   	100	0.5	0.5	0.5	0.9	0.9
```

### `--runs` - multiple runs

`--runs <N>` overrides the number of runs (default: 1). For more than 1 runs stats will be calculated.

```
$ npx pagespeed-score --runs 3 https://www.google.com
name  	score	FCP	FMP	SI	FCI	TTI
run 1 	96	0.9	1.0	1.2	3.1	3.9
run 2 	96	0.9	1.0	1.0	3.1	3.7
run 3 	95	0.9	1.0	1.2	3.5	4.0

median	96	0.9	1.0	1.2	3.1	3.9
stddev	0.6	0.0	0.0	0.1	0.2	0.2
min   	95	0.9	1.0	1.0	3.1	3.7
max   	96	0.9	1.0	1.2	3.5	4.0
```

### `--local` - local mode

Switches to running Lighthouse locally instead of calling the PSI API. This can be useful for non-public URLs (e.g. staging environment on a private network) or debugging. To ensure the local results are close to the PSI API results this module:

  * uses the same version of LightHouse as PSI (5.0.0 as of 26 June 2019) 
  * uses the [LightRider mobile config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js)
  * allows throttling of CPU with `--cpu-slowdown` (default 4x). Please note that PSI infrastructure already runs on a slower CPU (that's like a mobile device) hence the need to slow our laptops CPU down for local runs.
  * you can also use the same Chrome version as PSI (76 as of 21 June 2019) by specifying CHROME_PATH

```sh
CHROME_PATH="/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
npx pagespeed-score --local "<url>"
```

Local results will still differ from the PSI API because of local hardware and network variability.


### `LANTERN_DEBUG=true` - save metrics estimation traces

Setting `LANTERN_DEBUG=true` along with `--save-assets --local` will save traces for how metrics were simulated by Lantern.

```
$ LANTERN_DEBUG=true npx pagespeed-score \
> --local --save-assets https://www.google.com
name  	score	FCP	FMP	SI	FCI	TTI
run 1 	95	1.4	1.4	1.7	3.6	3.8

$ ls
1-0.devtoolslog.json
1-0.report.json
1-0.trace.json
1-optimisticFirstContentfulPaint.trace.json
1-optimisticFirstMeaningfulPaint.trace.json
1-optimisticFlexFirstContentfulPaint.trace.json
1-optimisticFlexFirstMeaningfulPaint.trace.json
1-optimisticFlexInteractive.trace.json
1-optimisticInteractive.trace.json
1-pessimisticFirstContentfulPaint.trace.json
1-pessimisticFirstMeaningfulPaint.trace.json
1-pessimisticInteractive.trace.json

```

You can drag and drop these traces on the Chrome Devtools Performance tab.

See also [lighthouse#5844 Better visualization of Lantern simulation](https://github.com/GoogleChrome/lighthouse/issues/5844).
