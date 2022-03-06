const { createClient } = require('@supabase/supabase-js');
const { SERVICE_ROLE_KEY, SUPABASE_URL } = process.env;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

module.exports = {
  addBuildLog: async (buildLog) => {
    const { error } = await supabase
      .from('build_logs')
      .insert({ sha: buildLog.sha, code: buildLog.code, log: buildLog.log });
    if (error) {
      throw new Error(`Unable to add ${buildLog.sha} to build_logs table ${error.message}`);
    }
  },
  getBuildLog: async (sha) => {
    const { data: buildLogs, error } = await supabase
      .from('build_logs')
      .select()
      .eq('sha', sha)
      .limit(1);
    if (error) {
      throw new Error(`Unable to get build log ${sha} ${error.message}`);
    }
    return buildLogs[0];
  },
};
