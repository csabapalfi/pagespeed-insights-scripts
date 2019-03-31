require = require('esm')(module, {await: true});

const {main} = require('./main.js');

(async() => await main())();
