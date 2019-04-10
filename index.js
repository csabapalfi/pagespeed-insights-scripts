#!/usr/bin/env node

require = require('esm')(module, {await: true});

const {main} = require('./lib/main.js');

(async() => await main())();
