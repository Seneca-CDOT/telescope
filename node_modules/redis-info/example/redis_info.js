var module_exist = require('node-module_exist'),
  redis_info = require('../')

  // Default fallback
  ,
  redis = {
    info: function (cb) {
      cb(null, 'redis_version:2.4.10\r\nredis_git_sha1:00000000\r\nredis_git_dirty:0\r\narch_bits:64\r\nmultiplexing_api:kqueue\r\ngcc_version:4.2.1\r\nprocess_id:3961\r\nuptime_in_seconds:1040648\r\nuptime_in_days:12\r\nlru_clock:44167\r\nused_cpu_sys:64.06\r\nused_cpu_user:84.21\r\nused_cpu_sys_children:0.15\r\nused_cpu_user_children:0.73\r\nconnected_clients:5\r\nconnected_slaves:0\r\nclient_longest_output_list:0\r\nclient_biggest_input_buf:0\r\nblocked_clients:0\r\nused_memory:15088992\r\nused_memory_human:14.39M\r\nused_memory_rss:21258240\r\nused_memory_peak:18985904\r\nused_memory_peak_human:18.11M\r\nmem_fragmentation_ratio:1.41\r\nmem_allocator:libc\r\nloading:0\r\naof_enabled:0\r\nchanges_since_last_save:0\r\nbgsave_in_progress:0\r\nlast_save_time:1341952654\r\nbgrewriteaof_in_progress:0\r\ntotal_connections_received:2069\r\ntotal_commands_processed:8897\r\nexpired_keys:0\r\nevicted_keys:0\r\nkeyspace_hits:2554\r\nkeyspace_misses:0\r\npubsub_channels:2\r\npubsub_patterns:0\r\nlatest_fork_usec:851\r\nvm_enabled:0\r\nrole:master\r\ndb0:keys=27012,expires=18\r\ndb15:keys=1,expires=0\r\n');
    },
    end: function () {}
  };

if (module_exist('redis')) {
  redis = require('redis').createClient();
}

/**
 * Helpers
 */
function join(sep) {
  return function (v) {
    return v.join(sep);
  };
};

function printDatabase(v) {
  return Object.keys(v).map(function (key) {
    return key + ': ' + v[key];
  }).join('\n') + "\n___________\n";
}

function print(array, mapper) {
  return '\n' + array.map(mapper).join('\n');
}


redis.info(function (err, info) {
  redis.end();

  var info = redis_info.parse(info);
  console.log('\n-- .contains(\'memory\')', print(info.contains('memory'), join(':')));
  console.log('\n-- .databases.length\n', info.databases.length);
  console.log('\n-- .databases', print(info.databases, printDatabase));
});
