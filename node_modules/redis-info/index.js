'use strict';
var _ = require('lodash');

module.exports = {
  parse: function (info) {
    return parseFields(splitStr(info));
  }
};


function startWith(pattern) {
  return function (value) {
    return value.indexOf(pattern) === 0;
  };
}


function split(s) {
  return function (v) {
    return v.split(s);
  };
}

function orEmptyStr(v) {
  return v || '';
}


function takeN(func, n) {
  return function (v) {
    return func(v[n]);
  };
}

function takeFirst(func) {
  return takeN(func, 0);
}

/**
 * Split the info string by \n and :
 * @param  {String} str the returned redis info
 * @return {Array}     Array of [key, value]
 */
function splitStr(str) {
  return str.split('\n')
    .filter(function (line) {
      return line.length > 0 && line.indexOf('#') !== 0;
    })
    .map(function (line) {
      return line.trim().split(':');
    });
}

function parseDatabases(info) {
  return info
    .filter(takeFirst(startWith('db')))
    .map(function _parseDatabaseInfo(args) {
      var dbName = args[0];
      var value = args[1];
      var values = orEmptyStr(value).split(',');

      function extract(param) {
        return parseInt(orEmptyStr(_.find(values, startWith(param))).split('=')[1] || 0, 10);
      }

      return {
        index: parseInt(dbName.substr(2), 10),
        keys: extract('keys'),
        expires: extract('expires')
      };
    })
    .reduce(function (m, v) {
      m[v.index] = {
        keys: v.keys,
        expires: v.expires
      };
      return m;
    }, {});
}

function parseCommands(info) {
  return _.fromPairs(info.filter(function (a) {
      return orEmptyStr(a[0]).indexOf('cmdstat_') === 0;
    })
    .map(function _parseCommands(args) {
      var v = args[0];
      var a = args[1];
      var val = _.fromPairs(orEmptyStr(a).split(',').map(split('=')));
      if (_.has(val, 'calls')) {
        val.calls = parseInt(val.calls, 10);
      }
      if (_.has(val, 'usec')) {
        val.usec = parseInt(val.usec, 10);
      }
      if (_.has(val, 'usec_per_call')) {
        val.usec_per_call = parseFloat(val.usec_per_call, 10);
      }
      return [orEmptyStr(v).split('_')[1], val];
    }));
}

function parseFields(info) {
  var fields = info.reduce(function (m, v) {
    if (!v[0].trim() || v[0].indexOf('db') === 0 ||  v[0].indexOf('cmdstat_') === 0) {
      return m;
    }
    m[v[0]] = v.slice(1).join(':');
    return m;
  }, {
    databases: parseDatabases(info),
    commands: parseCommands(info)
  });

  return fields;
}
