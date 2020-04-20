const formatDistance = require('date-fns/formatDistance');

// One of 'idle' or 'building'
let currentStatus = 'idle';
// When the last build completed
let recentBuildDate = null;
// Whether last build worked or failed
let recentBuildResult = null;
// Date when the last build began, null if not building.
let currentBuildStartedAt = null;

function handleStatus(req, res) {
  const info = {
    status: currentStatus,
  };

  if (recentBuildDate) {
    info.recentBuildDate = recentBuildDate;
  }

  if (recentBuildResult) {
    info.recentBuildResult = recentBuildResult;
  }

  // If a build is in progress, and we have a start time, format a duration
  if (currentBuildStartedAt) {
    info.started = currentBuildStartedAt;
    info.duration = formatDistance(new Date(), currentBuildStartedAt);
  }

  res.writeHead(200, { 'content-type': 'application/json' });
  res.write(JSON.stringify(info));
  res.end();
}

module.exports.buildStart = function (type) {
  currentBuildStartedAt = new Date();
  currentStatus = `building ${type}`;
};

module.exports.buildStop = function (code) {
  currentBuildStartedAt = null;
  recentBuildResult = code === 0 ? 'success' : 'failure';
  recentBuildDate = new Date();
  currentStatus = 'idle';
};

module.exports.handleStatus = handleStatus;
