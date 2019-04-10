# pagespeed-score

Get a less noisy Google PageSpeed Insights (PSI) score.

## Command Line

```sh
# pagespeed-score <url>
$ npx pagespeed-score https://www.google.com
92 # median pagespeed score based on 9 runs
```

* `--runs <number-of-runs>` number of runs
* `-v` output a table of metrics from all runs
* `--userTimingMarks.<alias>=<name>` add the User Timing mark startTime of a mark named `name` to your metrics table under a column named `alias`
* `--warmupRuns <number-of-warmup-runs>` number additional warmup runs excluded from the score median calculation (e.g. to allow CDN or other caches to warm up)

```sh
$ npx pagespeed-score -v --runs 3 https://www.google.com

fetchTime	score	TTFB	FCP	FMP	SI	FCI	TTI	benchmark
12:32:28	96	0.09	0.9	1.0	1.0	3.1	3.9	708
12:32:34	95	0.09	0.9	1.0	1.1	3.3	3.9	627
12:32:39	96	0.10	0.9	1.0	0.9	3.1	3.7	646


96
```

## Why?

The goal is to get a PSI score that has less variance than using the [PageSpeed Insights website](https://developers.google.com/speed/pagespeed/insights/).

## How

* doing multiple runs and taking the median based on score
* adding a cache-busting query param to avoid cached responses by the Google API

## Ideas/TODO

This module has an experimental [local mode](/local) that tries to replicate PSI scoring using local Lighthouse runs. Not recommended to try just yet and not even published with the module.
