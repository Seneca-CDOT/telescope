'use strict';
module.exports = {
  redis_version: '2.4.10',
  redis_git_sha1: '00000000',
  redis_git_dirty: '0',
  arch_bits: '64',
  multiplexing_api: 'kqueue',
  gcc_version: '4.2.1',
  process_id: '3961',
  uptime_in_seconds: '681311',
  uptime_in_days: '7',
  lru_clock: '8233',
  used_cpu_sys: '45.19',
  used_cpu_user: '59.74',
  used_cpu_sys_children: '0.15',
  used_cpu_user_children: '0.73',
  connected_clients: '4',
  connected_slaves: '0',
  client_longest_output_list: '0',
  client_biggest_input_buf: '0',
  blocked_clients: '0',
  used_memory: '15080416',
  used_memory_human: '14.38M',
  used_memory_rss: '21258240',
  used_memory_peak: '18985904',
  used_memory_peak_human: '18.11M',
  mem_fragmentation_ratio: '1.41',
  mem_allocator: 'libc',
  loading: '0',
  aof_enabled: '0',
  changes_since_last_save: '0',
  bgsave_in_progress: '0',
  last_save_time: '1341952654',
  bgrewriteaof_in_progress: '0',
  total_connections_received: '1501',
  total_commands_processed: '8325',
  expired_keys: '0',
  evicted_keys: '0',
  keyspace_hits: '2554',
  keyspace_misses: '0',
  pubsub_channels: '2',
  pubsub_patterns: '0',
  latest_fork_usec: '851',
  vm_enabled: '0',
  role: 'master',
  databases: {
    '0': {
      keys: 27012,
      expires: 18
    },
    '15': {
      keys: 1,
      expires: 0
    }
  },
  commands: {
    set: {
      calls: 1,
      usec: 15,
      usec_per_call: 15
    },
    lpush: {
      calls: 1,
      usec: 14,
      usec_per_call: 14
    },
    zadd: {
      calls: 2,
      usec: 84,
      usec_per_call: 42
    },
    hset: {
      calls: 1,
      usec: 26,
      usec_per_call: 26
    },
    keys: {
      calls: 2,
      usec: 91,
      usec_per_call: 45.5
    },
    info: {
      calls: 5,
      usec: 807,
      usec_per_call: 161.4
    },
    ttl: {
      calls: 1,
      usec: 6,
      usec_per_call: 6
    },
    slowlog: {
      calls: 4,
      usec: 47,
      usec_per_call: 11.75
    }
  }
};
