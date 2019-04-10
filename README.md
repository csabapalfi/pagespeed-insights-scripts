# pagespeed-score

Get a [Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) score with less variability.

See example run below: 

```
$ npx pagespeed-score --runs 3 https://www.google.com
fetchTime	score	FCP	FMP	SI	FCI	TTI
00:15:25	96	0.9	1.0	1.0	3.1	3.7
00:15:31	95	0.9	1.0	1.1	3.4	3.9
00:15:38	96	0.9	1.0	1.0	3.2	3.7

median  	96	0.9	1.0	1.0	3.2	3.7
stddev  	0.6	0.0	0.0	0.1	0.2	0.1
min     	95	0.9	1.0	1.0	3.1	3.7
max     	96	0.9	1.0	1.1	3.4	3.9
```

Note: most pages have much higher variability in their score.

## Metrics

* `fetchTime` is simply the time of the day (in UTC) when the run completed.

* `score` is the PageSpeed score based on [LightHouse perfomance scoring](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) calculated using FCP, FMP, SI, FCI and TTI.

* `FCP` is [First Contentful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-contentful-paint-fcp)

* `FMP` is [First Meaningful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-meaningful-paint-fmp)

* `SI` is [Speed Index](https://github.com/csabapalfi/awesome-web-performance-metrics#speed-index)

* `FCI` is [First CPU Idle](https://github.com/csabapalfi/awesome-web-performance-metrics#first-cpu-idle)

* `TTI` is [Time to Interactive](https://github.com/csabapalfi/awesome-web-performance-metrics#time-to-interactive-tti)

## Command Line Options

```
Runs:
  --runs        Number of runs                             [number] [default: 9]
  --warmupRuns  Number of warmup runs                      [number] [default: 0]

Additional metrics:
  --userTimingMarks  Specified User Timing marks                   [default: {}]
  --ttfb             TTFB                             [boolean] [default: false]
  --benchmark        Benchmark index                  [boolean] [default: false]

Output:
  --stats  Output result statistics                    [boolean] [default: true]
  --jsonl  Output as JSON Lines                       [boolean] [default: false]
```

* `--warmupRuns <N>` makes N warmup runs before, these excluded from stats (e.g. to allow CDN or other caches to warm up)

* `--userTimingMarks.<alias>=<name>` adds any User Timing mark named to your metrics with the name `alias` (e.g. `--userTimingMarks.DPA=datepicker.active`)

* `--ttfb` adds [Time to First Byte](https://developers.google.com/web/tools/lighthouse/audits/ttfb) to your metrics - can help identifying if a run was affected by your server response time variability

* `--benchmark` adds the Lighthouse CPU/memory power [benchmarkIndex](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154) to your metrics - can help identifying if a run was affected by PSI server-side variability or resource contention

* `--stats` outputs result statistics (median, stddev, min, max)

* `--jsonl` outputs results (and statistics) as [JSON Lines](http://jsonlines.org/)
