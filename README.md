# pagespeed-score

Get a [Google PageSpeed Insights (PSI)](https://developers.google.com/speed/pagespeed/insights/) score with less variability.

See example run below: 

```
$ npx pagespeed-score --runs 3 https://www.google.com
fetchTime	score	TTFB	FCP	FMP	SI	FCI	TTI	benchmark
19:41:58	96	0.08	0.9	1.0	1.1	3.2	3.8	627
19:42:04	96	0.08	0.9	1.0	1.0	3.2	3.8	626
19:42:10	96	0.08	0.9	1.0	0.9	3.1	3.9	695

Median  	96	0.08	0.9	1.0	1.0	3.2	3.8	627.0
Std Dev 	0	0.00	0.00	0.00	0.10	0.06	0.06	39.6
Minimum 	96	0.08	0.9	1.0	0.9	3.1	3.8	626.0
Maximum 	96	0.08	0.9	1.0	1.1	3.2	3.9	695.0
```

Note: most pages have much higher variability in their score.

See [what each metric is below](#metrics).

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

Futher explanation:

* `--stats` output median, standard deviation, min and max for each metric

* `--warmupRuns <N>` makes N warmup runs before, these excluded from stats (e.g. to allow CDN or other caches to warm up)

* `--userTimingMarks.<alias> <name>` adds the User Timing mark named `name` to your metrics with the name `alias` (e.g. `--userTimingMarks.DPA=datepicker.active`)

* `--format jsonl` outputs metrics and stats in [JSON Lines](http://jsonlines.org/) format

## Metrics

* `fetchTime` is simply the time of the day (in UTC) when the run completed.

* `score` is the PageSpeed score based on [LightHouse perfomance scoring](https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md) and calculated using FCP, FMP, SI, FCI and TTI (and nothing else).

* `TTFB` is [Time to First Byte](https://developers.google.com/web/tools/lighthouse/audits/ttfb) - can help identifying if a run was affected by your server response time variability

* `FCP` is [First Contentful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-contentful-paint-fcp)

* `FMP` is [First Meaningful Paint](https://github.com/csabapalfi/awesome-web-performance-metrics#first-meaningful-paint-fmp)

* `SI` is [Speed Index](https://github.com/csabapalfi/awesome-web-performance-metrics#speed-index)

* `FCI` is [First CPU Idle](https://github.com/csabapalfi/awesome-web-performance-metrics#first-cpu-idle)

* `TTI` is [Time to Interactive](https://github.com/csabapalfi/awesome-web-performance-metrics#time-to-interactive-tti)

* `benchmark` is the Lighthouse CPU/memory power [benchmarkIndex](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/lib/page-functions.js#L128-L154) - can help identifying if a run was affected by PSI server-side variability or resource contention
