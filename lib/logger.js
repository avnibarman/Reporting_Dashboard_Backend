var bunyan = require('bunyan');
var pkg = require('../package.json');
const conf = require('../config');

var options = {
  serializers: bunyan.stdSerializers,
  name: pkg.name,
  streams: [
    {
      type: 'rotating-file',
      path: conf.get('logDirectory') + '/' + pkg.name + '.log',
      period: '1d',
      count: 14,
      level: conf.get('logLevel')
    }
  ]
};

module.exports = bunyan.createLogger(options);