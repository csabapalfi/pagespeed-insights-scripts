# pagespeed-score

[![Build Status](https://travis-ci.org/csabapalfi/pagespeed-score.svg?branch=master)](https://travis-ci.org/csabapalfi/pagespeed-score/)
[![Coverage Status](https://coveralls.io/repos/github/csabapalfi/pagespeed-score/badge.svg?2)](https://coveralls.io/github/csabapalfi/pagespeed-score)

Google PageSpeed score command line toolkit

Get a score and metrics via the Google PageSpeed Insights API or a local Lighthouse run.

- [Requirements](#requirements)
- [Usage](#usage)
  * [`--runs`,`--warmup-runs` - multiple runs](#--runs--warmup-runs---multiple-runs)
  * [`--local` - local mode](#--local---local-mode)
  * [`--benchmark` - output CPU/memory benchmark](#--benchmark---output-cpumemory-benchmark)
  * [` --ttfb` - output Time to First Byte](#---ttfb---output-time-to-first-byte)
  * [`--usertiming-marks` - output user timing marks](#--usertiming-marks---output-user-timing-marks)
  * [`--lantern-debug` - save metrics estimation traces](#--lantern-debug---save-metrics-estimation-traces)
- [Learn more about the score](#learn-more-about-the-score)
  * [PageSpeed Insights score = Lighthouse score](#pagespeed-insights-score--lighthouse-score)
  * [The 5 metrics that affect the score](#the-5-metrics-that-affect-the-score)
  * [Not all metrics are weighted equally](#not-all-metrics-are-weighted-equally)
  * [Metrics are estimated with a simulation (Lantern)](#metrics-are-estimated-with-a-simulation-lantern)


## Recommendations for using the score and metrics values

* **Use the score to look for longer-term trends and identify big changes**; but prefer your own analytics/field data for finer details
* **Individual metrics marked slow (red) usually highlight genuine problems**, even though actual values are not 100% accurate
* **Reduce variability by doing multiple runs, forcing A/B test variants, and other means** — but even with reduced variability, some inherent inaccuracies remain

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

### `--runs`,`--warmup-runs` - multiple runs

Test multiple times and take the median (or more/better statistics) of the score to reduce the impact of outliers (independent of what’s causing this variability). 

* `--runs <N>` overrides the number of runs (default: 1). For more than 1 runs stats will be calculated.

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

* `--warmup-runs <N>` add warmup runs that are excluded from stats (e.g. to allow CDN or other caches to warm up)

### `--local` - local mode

`pagespeed-score --local` switches to running Lighthouse locally instead of calling the PSI API. This can be useful for non-public URLs (e.g. staging environment on a private network) or debugging. To ensure the local results are close to the PSI API results this module:

  * uses the same version of LightHouse as PSI (5.0.0 as of 26 June 2019) 
  * uses the [LightRider mobile config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-mobile-config.js)
  * allows throttling of CPU with `--cpu-slowdown` (default 4x). Please note that PSI infrastructure already runs on a slower CPU (that's like a mobile device) hence the need to slow our laptops CPU down for local runs.
  * you can also use the same Chrome version as PSI (76 as of 21 June 2019) by specifying CHROME_PATH

```sh
CHROME_PATH="/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
npx pagespeed-score --local "<url>"
```

Local results will still differ from the PSI API because of local hardware and network variability.

### `--benchmark` - output CPU/memory benchmark

Lighthouse computes a memory/CPU performance [benchmark index]((https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154)) to determine rough device class. Variability in this can help identifying [Client Hardware Variability](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit#heading=h.km3f9ebrlnmi) or [Client Resource Contention](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit#heading=h.9gqujdsfrbou). These are less likely to occur with PSI that uses a highly controlled lab environment and can affect local Lighthouse runs more.

* `--benchmark` adds the benchmark index as a metric for each test run

### ` --ttfb` - output Time to First Byte

Time to First Byte (TTFB) has a very limited impact on the score but can be useful indicator of [Web Server Variability](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit#heading=h.6rnl1clafpqn). Please note that TTFB is not estimated by Lantern but based on the observed/fast trace.

* ` --ttfb` adds TTFB as a metric for each test run

### `--usertiming-marks` - output user timing marks

We use a number of User Timing marks and high variability in these can mean you have [Page Nondeterminism](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit#heading=h.js7k0ib0mzzv) or other sources variability. Please note user timing marks are not estimated by Lantern but based on the observed/fast trace.

You can use the `pagespeed-score` cli to monitor them:

* `--usertiming-marks.<alias>=<name>` adds any User Timing mark named to your metrics with the name `alias` (e.g. `--usertiming-marks.DPA=datepicker.active`)

### `--lantern-debug` - save metrics estimation traces

In case you want to understand how exactly Lantern estimated a metric you can make Lighthouse save the traces resulting from the simulations:

```sh
LANTERN_DEBUG=true npx lighthouse --save-assets <url> 
```

Use the Chrome Devtools Performance tab to open the traces. Subscribe to [lighthouse#5844](https://github.com/GoogleChrome/lighthouse/issues/5844) for future updates on this.

You can also use `pagespeed-score` in [local mode](#local-mode) that has builtin support for this and also ensures that your lighthouse setup is as close to PSI as possible:

```sh
CHROME_PATH="/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
npx pagespeed-score --local --save-assets --lantern-debug "<url>"
```

## Learn more about the score

Learn more by reading my blog post: [What's in the Google PageSpeed score?](https://medium.com/expedia-group-tech/whats-in-the-google-pagespeed-score-a5fc93f91e91)

### PageSpeed Insights score = Lighthouse score

The [Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) score is based on [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) run.

### The 5 metrics that affect the score

The [Lighthouse scoring documentation](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) explains that the performance score is determined using the following estimated metrics:

| Estimated Metric            | Short Description |
|:----------------------------|-------------|
| First Contentful Paint (FCP)| when the first text or image content is painted |
| First Meaningful Paint (FMP)| when the primary content of a page is visible |
| Speed Index (SI)            | how quickly the contents of a page are visibly populated |
| First CPU Idle (FCI)        | when the main thread first becomes quiet enough to handle input |
| Time to Interactive (TTI)   | when the main thread and network is quiet for at least 5s |

**None of the other Lighthouse audits have a direct impact on the score**, but they do give hints on improving the metrics. To learn more about the metrics, check out my [awesome-web-performance-metrics](https://github.com/csabapalfi/awesome-web-performance-metrics) repo.

### Not all metrics are weighted equally

Lighthouse calculates a speed score for all 5 metrics based on their estimated values, then calculates a weighted average to get an aggregate speed score. The metric weights and fast/slow thresholds are available in the table below:

| Estimated Metric            | Weight | Fast  | Slow  |
|:----------------------------|:------:|:-----:|:-----:|
| First Contentful Paint (FCP)|    3   | <2.4s | >4.0s |
| First Meaningful Paint (FMP)|    1   | <2.4s | >4.0s |
| Speed Index (SI)            |    4   | <3.4s | >5.8s | 
| First CPU Idle (FCI)        |    2   | <3.6s | >6.5s | 
| Time to Interactive (TTI)   |    5   | <3.8s | >7.3s |

### Metrics are estimated with a simulation (Lantern) 

[Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md) is the part of Lighthouse that models page activity and simulates browser execution to estimate metrics.