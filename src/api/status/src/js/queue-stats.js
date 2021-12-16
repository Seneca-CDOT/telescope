const { fetch, logger } = require('@senecacdot/satellite');

module.exports = async function getJobCount() {
  try {
    const data = await fetch(`${process.env.POSTS_URL}/feeds/info`, { method: 'GET' });
    const { queueInfo } = await data.json();
    return queueInfo.jobCnt;
  } catch (error) {
    logger.warn({ error }, 'Failed to get feed queue info');
  }
  return 0;
};
