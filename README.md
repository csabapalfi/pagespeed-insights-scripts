# PageSpeed Insights scripts

Small scripts and recipes to run PageSpeed Insights via the API, save results, summarise and export to tsv.

- [PageSpeed Insights scripts](#pagespeed-insights-scripts)
  - [Setup](#setup)
    - [Dependencies](#dependencies)
    - [Get an API key and set `PSI_API_KEY`](#get-an-api-key-and-set-psi_api_key)
    - [Save your URLs to test in `urls.tsv`](#save-your-urls-to-test-in-urlstsv)
  - [Usage](#usage)
    - [Capture a snapshot](#capture-a-snapshot)
    - [Capture snapshots every 5 mins](#capture-snapshots-every-5-mins)
    - [Show lab data report](#show-lab-data-report)
    - [Save lab data report as tsv](#save-lab-data-report-as-tsv)
  - [Caveats](#caveats)

## Setup

### Dependencies

- `bash`
- `node>12`
- no node modules or anything else to install

### Get an API key and set `PSI_API_KEY`

See https://developers.google.com/speed/docs/insights/v5/get-started

`export PSI_API_KEY=<api-key>`

### Save your URLs to test in `urls.tsv`

- the expected format is `url\tname`, e.g. `https://web.dev/ homepage`
- name is optional, the default name is the URL path

```bash
cat > urls.tsv <<EOF
https://web.dev/	homepage
https://web.dev/fast/
EOF
```

## Usage

### Capture a snapshot

`./captute-snapshot [snapshotsDirectory] [urlsTsvFile]`

Save PageSpeed Insights API results

- in `snapshotsDirectory` (default: `snapshots`)
- for all URLs in `urlsTsvFile` (default: `urls.tsv`)
- then show PageSpeed Insights **lab data** summary for current snapshot

Example:

```bash
./capture-snapshot
```

Output:

```
created snapshots/2021-03-19_21-34-27/
running pagespeed insights for https://web.dev/...
running pagespeed insights for https://web.dev/fast/...

Score	FCP	LCP	TBT	CLS	Timestamp			URL
95	1.1 s	2.8 s	70 ms	0	2021-03-19T21:34:28.785Z	/fast/
99	1.1 s	1.6 s	30 ms	0	2021-03-19T21:34:29.159Z	homepage
```

Files created:

```
snapshots/2021-03-19_21-34-27/homepage.json
snapshots/2021-03-19_21-34-27/fast.json
```

### Capture snapshots every 5 mins

Example:

```bash
watch -c -n 300 ./capture-snapshot
```

Output:

```
Every 300.0s: ./capture-snapshot

created snapshots/2021-03-20_00-28-01/
running pagespeed insights for https://web.dev/...
running pagespeed insights for https://web.dev/fast/...

Timestamp               FCP     LCP     CLS     TBT             Score   URL
2021-03-20 00:28:02      1.8 s   2.1 s   0.001      30 ms          98   /fast/
2021-03-20 00:28:02      1.8 s   2.6 s       0      40 ms          96   homepage
```

Files created:

- Every 5 minutes a timestamp directory is created with the latest results

### Show lab data report

`./lab-report [snapshotsDirectory] [filter]`

Show PageSpeed Insights **lab data** summary:

- for all results in `snapshotsDirectory` recursively (default: current directory)
- if `filter` is set then only show results where URL or path or name matches `filter` (default: show all URLs)

The summary shows:

- `Timestamp`: human readable timestamp
- `FCP`, `LCP`, `CLS` and `TBT` formatted (and colored) lab data values
- `Score` 0-100 colored performance score
- `URL` the requested URL path (or name), or in case of a redirect `<requestPathOrName> -> <finalPath>`

Example:

```bash
./lab-report snapshots/ /fast/
```

Output:

```
Timestamp          	FCP   	LCP   	CLS  	TBT      	Score 	URL
2021-03-19 21:48:49	 1.8 s	 2.0 s	     0	    60 ms	   98	/fast/
2021-03-19 21:49:00	 1.8 s	 2.1 s	     0	    70 ms	   98	/fast/
```

### Save lab data report as tsv

`NO_FORMAT=1 NO_COLOR=1 ./summarize-reports [snapshotsDirectory] [filter] > tsvFileName`

Save PageSpeed Insights **lab data** report into `tsvFileName`:

- without colors or formatting
- ready to be imported into e.g. Google Sheets

The tsv rows will have the following fields:

- `Timestamp`: ISO date time value
- `FCP`, `LCP`, `CLS` and `TBT` lab data raw numeric values
- `Score` 0-100 performance score
- `URL` the requested URL path (or name), or in case of a redirect `<requestPathOrName> -> <finalPath>`

Example:

```bash
NO_FORMAT=1 NO_COLOR=1 ./lab-report snapshots/ > data.csv
```

Files created:

```
data.tsv
```

## Caveats

- few nights hack
- no tests
- not originally intended for public consumption
