# What's in the Google PageSpeed score?



## tl;dr

[Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) is based on [Google Lighthouse (LH)](https://developers.google.com/web/tools/lighthouse/). Lighthouse **calculates a speed score based on 5 estimated metrics** and [scores and weights](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) them like the example below. Values are in seconds and a score of 90-100 is fast, 50-89 is average and 0-49 is slow.

| Estimated Metric             | Weight | Description |
|------------------------------|--------|-------------|
| First Contentful Paint (FCP) |    3   | when the first text or image content is painted |
| First Meaningful Paint (FMP) |    1   | when the primary content of a page is visible |
| Speed Index (SI)             |    4   | how quickly the contents of a page are visibly populated |
| First CPU Idle (FCI)         |    2   | when the main thread is quiet enough to handle user input |
| Time to Interactive (TTI)    |    5   | how quickly the main thread and network quiets down for at least 5 seconds |

**Other audits have no direct impact on the score** (but give hints to improve the metrics).

**The metrics estimation (code-named [Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md)) models and simulates browser execution.** Lantern can emulate mobile network and CPU execution. To achieve this it only relies on a performance trace observed without any throttling (hence the fast execution time).

There’s an [accuracy and variability analysis](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit#) available. Lantern trades off accuracy but also mitigates certain sources variability. Metrics can be over/underestimated because of: 

* differences in the unthrottled trace vs real device/throttling
* details ignored or simplified to make the simulation workable

Recommendations for using the score:
* Even if not 100% accurate **metrics in the red highlight genuine/urgent problems**
* Use the scores to **look for longer term trends and bigger changes**
* Reduce variability by forcing AB tests, doing multiple runs, etc
* but even reduced variability is not removing inherent inaccuracies
* Use the pagespeed-score cli (this repo/module) to reduce/identify variability and to investigate inaccuracies


[![Build Status](https://travis-ci.org/csabapalfi/pagespeed-score.svg?branch=master)](https://travis-ci.org/csabapalfi/pagespeed-score/)
[![Coverage Status](https://coveralls.io/repos/github/csabapalfi/pagespeed-score/badge.svg?2)](https://coveralls.io/github/csabapalfi/pagespeed-score)

## Google PageSpeed Insights (PSI) score and metrics CLI

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

### Metrics

* `score` is the PageSpeed score based on [LightHouse perfomance scoring](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) calculated using FCP, FMP, SI, FCI and TTI.

* `FCP` is [First Contentful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-contentful-paint-fcp)

* `FMP` is [First Meaningful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-meaningful-paint-fmp)

* `SI` is [Speed Index](https://github.com/csabapalfi/awesome-web-performance-metrics#speed-index)

* `FCI` is [First CPU Idle](https://github.com/csabapalfi/awesome-web-performance-metrics#first-cpu-idle)

* `TTI` is [Time to Interactive](https://github.com/csabapalfi/awesome-web-performance-metrics#time-to-interactive-tti)

### Command Line Options

```
Runs:
  --runs         Number of runs                            [number] [default: 1]
  --warmup-runs  Number of warmup runs                     [number] [default: 0]

Additional metrics:
  --usertiming-marks,                       User Timing marks
  --metrics.userTimingMarks                                        [default: {}]
  --ttfb, --metrics.ttfb                    TTFB      [boolean] [default: false]
  --benchmark, --metrics.benchmark          Benchmark index
                                                      [boolean] [default: false]

Output:
  --jsonl, --output.jsonl                 Output as JSON Lines
                                                      [boolean] [default: false]
  --save-assets, --output.saveAssets      Save reports and traces
                                                      [boolean] [default: false]
  --file-prefix, --output.filePrefix      Saved asset file prefix
                                                          [string] [default: ""]
  --lantern-debug, --output.lanternDebug  Save Lantern traces
                                                      [boolean] [default: false]

Lighthouse:
  --local, --lighthouse.enabled             Switch to local Lighthouse
                                                      [boolean] [default: false]
  --lighthouse-path,                        Lighthouse module path
  --lighthouse.modulePath                       [string] [default: "lighthouse"]
  --cpu-slowdown, --lighthouse.cpuSlowDown  CPU slowdown multiplier
                                                           [number] [default: 4]

```

* `--runs <N>` overrides the number of runs (default: 1). For more than 1 runs stats will be calculated.

* `--warmup-runs <N>` add warmup runs that are excluded from stats (e.g. to allow CDN or other caches to warm up)

* `--usertiming-marks.<alias>=<name>` adds any User Timing mark named to your metrics with the name `alias` (e.g. `--usertiming-marks.DPA=datepicker.active`)

* `--ttfb` adds [Time to First Byte](https://developers.google.com/web/tools/lighthouse/audits/ttfb) to your metrics - can help identifying if a run was affected by your server response time variability

* `--benchmark` adds the Lighthouse CPU/memory power [benchmarkIndex](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154) to your metrics - can help identifying if a run was affected by Google server-side variability or resource contention

* `--jsonl` outputs results (and statistics) as [JSON Lines](http://jsonlines.org/) instead of TSV

* `--save-assets` saves a report for each run

### Local mode

`--local` switches to running Lighthouse locally instead of calling the PSI API. This can be useful for non-public URLs (e.g. staging environment on a private network). To ensure the local results are close to the PSI API results this module:

  * uses the same version of LightHouse as PSI
  * uses the [LightRider mobile config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js)
  * allows throttling of CPU with `--cpu-slowdown` (default 4x)

Local results will still differ from the PSI API because of local hardware and network variability.

### Debugging metrics simulations (Lantern)

`--lantern-debug --save-assets --local` will also save traces and devtoolslogs and traces for how metrics were simulated by Lantern

```
$ npx pagespeed-score \
--local --lantern-debug --save-assets https://www.google.com
```

You can open any of these traces in the Chrome Devtools Performance tab. 

See also [lighthouse#5844 Better visualization of Lantern simulation](https://github.com/GoogleChrome/lighthouse/issues/5844).
