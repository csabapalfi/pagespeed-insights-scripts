# pagespeed-score

Get a less noisy Google PageSpeed Insights (PSI) score.

## Command Line

```sh
# pagespeed-score --runs <N> <url>
$ npx pagespeed-score https://www.google.com
92 # median pagespeed score based on <N> runs 
```

## Why?

The goal is to get a PSI score that has less variance than using the [PageSpeed Insights website](https://developers.google.com/speed/pagespeed/insights/).

## How

* doing multiple runs and taking the median based on score
* adding a cache-busting query param to avoid cached responses by the Google API

## Ideas/TODO

This module has an [local version](/local) (alpha quality) that tries to replicate PSI scoring using local Lighthouse runs.
