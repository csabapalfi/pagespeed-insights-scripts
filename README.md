# pagespeed-score

Get a [Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) score with less variability.


```sh
# pagespeed-score <url>
$ npx pagespeed-score https://www.google.com
92 # median pagespeed score based on 9 runs
```

## Command Line Arguments

```
Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --runs             Number of runs                        [number] [default: 9]
  --warmupRuns       Number of warmup runs                 [number] [default: 0]
  --stats            Output stats                      [boolean] [default: true]
  --userTimingMarks  User Timing marks to include in metrics       [default: {}]
  --format           Output format
                             [string] [choices: "jsonl", "tsv"] [default: "tsv"]
```

* `--userTimingMarks.<alias>=<name>` add the User Timing mark startTime of a mark named `name` to your metrics table under a column named `alias`
* `--warmupRuns <number-of-warmup-runs>` number additional warmup runs excluded from the score median calculation (e.g. to allow CDN or other caches to warm up)

## Metrics

See example tsv output below:

```sh
$ npx pagespeed-score -v --runs 3 https://www.google.com

fetchTime	score	TTFB	FCP	FMP	SI	FCI	TTI	benchmark
12:32:28	96	0.09	0.9	1.0	1.0	3.1	3.9	708
12:32:34	95	0.09	0.9	1.0	1.1	3.3	3.9	627
12:32:39	96	0.10	0.9	1.0	0.9	3.1	3.7	646


96
```

* `fetchTime` is simply the time of the day (in UTC) when the run completed.

* `score` is the PageSpeed score based on [LightHouse perfomance scoring](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) and calculated using FCP, FMP, SI, FCI and TTI (and nothing else).

* `TTFB` is [Time to First Byte](https://developers.google.com/web/tools/lighthouse/audits/ttfb) - can help identifying if a run was affected by your server response time variability

* `FCP` is [First Contentful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-contentful-paint-fcp)

* `FMP` is [First Meaningful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-meaningful-paint-fmp)

* `SI` is [Speed Index](https://github.com/csabapalfi/awesome-web-performance-metrics#speed-index)

* `FCI` is [First CPU Idle](https://github.com/csabapalfi/awesome-web-performance-metrics#first-cpu-idle)

* `TTI` is [Time to Interactive](https://github.com/csabapalfi/awesome-web-performance-metrics#time-to-interactive-tti)

* `benchmark` is the Lighthouse CPU/memory power [benchmarkIndex](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154) - can help identifying if a run was affected by PSI server-side variability or resource contention
