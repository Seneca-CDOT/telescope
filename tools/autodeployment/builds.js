const { logger, createError } = require('@senecacdot/satellite');
const shell = require('shelljs');
const mergeStream = require('merge-stream');
const { ReReadable } = require('rereadable-stream');

class Build {
  constructor(type, githubData) {
    this.type = type;
    this.githubData = githubData;
    this.startedDate = new Date();

    // Start a build log cache that we can re-play as many times as necessary
    this.cache = new ReReadable();
  }

  finish(code) {
    logger.debug({ code }, 'build finished');
    this.stoppedDate = new Date();
    this.code = code;

    // Drop the output stream
    if (this.out) {
      this.out.removeAllListeners();
      this.out = null;
    }
    // Drop the deploy process
    if (this.proc) {
      this.proc = null;
    }
  }

  toJSON() {
    const build = {
      type: this.type,
      githubData: this.githubData,
      startedDate: this.startedDate,
      code: this.code,
    };

    if (this.stoppedDate) {
      build.stoppedDate = this.stoppedDate;
    }

    return build;
  }
}

// Simple queue of builds we have to do
const builds = {
  // Whatever built most recently
  previous: null,
  // Whatever we're building now
  current: null,
  // Whatever we're building next
  pending: null,
};

function run() {
  // Run the next build, unless we're already running one
  if (builds.current) {
    logger.debug('run() called, but build already running, skipping.');
    return;
  }

  // See if there's anything waiting to be built
  if (!builds.pending) {
    logger.debug('run() called, but no pending build to run, skipping.');
    return;
  }

  // Promote the next build to current and start it
  const build = builds.pending;
  const { cache } = build;

  builds.current = build;
  builds.pending = null;

  logger.debug('run() called, starting pending build');
  build.proc = shell.exec(
    `./deploy.sh ${build.type} ${build.githubData.after}`,
    { silent: true },
    (code) => {
      build.finish(code);
      builds.previous = builds.current;
      builds.current = null;

      // See if there's another build ready to go
      run();
    }
  );

  // Combine stderr and stdout, like 2>&1
  build.out = mergeStream(build.proc.stdout, build.proc.stderr);
  // Pipe the output of the build process into our build's cache log stream
  build.out.pipe(cache);
}

module.exports.addBuild = function (type, githubData) {
  // If we're in the middle of a build, queue this build until we're done.
  // If there's already a queued build waiting, replace it with this one,
  // since the most recent one is the one we really care about.
  builds.pending = new Build(type, githubData);
  logger.debug({ type }, 'addBuild() called');
  run();
};

module.exports.buildStatusHandler = function handleStatus(req, res) {
  res.json(builds);
};

/**
 * @param {'current' | 'previous'} buildName
 */
function handleBuildByName(buildName) {
  return (req, res, next) => {
    const build = builds[buildName];

    if (!build) {
      next(createError(404, 'no build log found'));
      return;
    }

    const { out, cache } = build;

    // If we have a build process, pipe that, otherwise we're done
    const pipeLog = () => (out ? out.pipe(res) : res.end());

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the cached build log, which is either everything, or everything so far.
    // After we're done, pipe the rest of the log as it happens.
    if (cache) {
      cache.rewind().pipe(res).on('end', pipeLog);
    } else {
      pipeLog();
    }
  };
}

/**
 * @param {'current' | 'previous'} buildName type of build
 */
module.exports.buildLogHandler = (buildName = 'current') => handleBuildByName(buildName);
