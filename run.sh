#!/bin/bash

lighthouse --quiet --config-path=./config.js "$1" \
  --output=json --chrome-flags="--headless" | \
  jq '.categories.performance.score * 100'