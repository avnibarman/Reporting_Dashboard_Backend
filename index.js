'use strict';

// Load config
const conf = require('./config');
var env = conf.get('env');

// Load modules
const Hapi = require('hapi');
const queryString = require('querystring');

// Use lodash utilities
const _ = require('lodash');

