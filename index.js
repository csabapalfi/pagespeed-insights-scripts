#!/usr/bin/env node

/* eslint-disable-next-line no-global-assign */
require = require('esm')(module, {await: true});

const {main} = require('./lib/main.js');

(async() => await main())();
