const { addBuildLog, getBuildLog } = require('../utils/storage');
class BuildLog {
  constructor(sha, code, log) {
    this.sha = sha;
    this.code = code;
    this.log = log;
  }
  add() {
    return addBuildLog(this);
  }
  static async bySha(sha) {
    const data = await getBuildLog(sha);
    if (!(data && data.sha)) {
      return null;
    }
    return new BuildLog(data.sha, data.code, data.log);
  }
  static async create(buildLogData) {
    const buildLog = new BuildLog(buildLogData.sha, buildLogData.code, buildLogData.log);
    await buildLog.add();
    return buildLog.sha;
  }
}

module.exports = BuildLog;
