# pagespeed-score

Get a [Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) score with less variability.


```sh
# pagespeed-score <url>
$ npx pagespeed-score https://www.google.com
92 # median pagespeed score based on 9 runs
```

## Command Line Arguments

* `--runs <number-of-runs>` number of runs
* `-v` output a table of metrics from all runs
* `--userTimingMarks.<alias>=<name>` add the User Timing mark startTime of a mark named `name` to your metrics table under a column named `alias`
* `--warmupRuns <number-of-warmup-runs>` number additional warmup runs excluded from the score median calculation (e.g. to allow CDN or other caches to warm up)

## Metrics in verbose mode

See example verbose (`-v`) output here:

```sh
$ npx pagespeed-score -v --runs 3 https://www.google.com

fetchTime	score	TTFB	FCP	FMP	SI	FCI	TTI	benchmark
12:32:28	96	0.09	0.9	1.0	1.0	3.1	3.9	708
12:32:34	95	0.09	0.9	1.0	1.1	3.3	3.9	627
12:32:39	96	0.10	0.9	1.0	0.9	3.1	3.7	646


96
```

`fetchTime` is simply the time of the day (in UTC) when the run completed.

The PageSpeed `score` is based on [LightHouse perfomance scoring](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) and calculated using the following 5 metrics (and nothing else):

* [First Contentful Paint (`FCP`)](https://github.com/csabapalfi/awesome-web-performance-metrics#first-contentful-paint-fcp)
* [First Meaningful Paint (`FMP`)](https://github.com/csabapalfi/awesome-web-performance-metrics#first-meaningful-paint-fmp)
* [Speed Index (`SI`)](https://github.com/csabapalfi/awesome-web-performance-metrics#speed-index)
* [First CPU Idle (`FCI`)](https://github.com/csabapalfi/awesome-web-performance-metrics#first-cpu-idle)
* [Time to Interactive (`TTI`)](https://github.com/csabapalfi/awesome-web-performance-metrics#time-to-interactive-tti)

The following metrics are also returned as they can highlight sources of variabilty:

* Time to First Byte (`TTFB`) - [The time at which your server sends a response](https://developers.google.com/web/tools/lighthouse/audits/ttfb)- can help identifying if a run was affected by your server response time variability
* Benchmark Index (`benchmark`) - Lighthouse [CPU/memory power benchmark](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154)) - can help identifying if a run was affected by PSI server-side variability or resource contention
