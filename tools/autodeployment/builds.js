const { logger, createError } = require('@senecacdot/satellite');
const shell = require('shelljs');
const mergeStream = require('merge-stream');
const streamBuffers = require('stream-buffers');

class Build {
  constructor(type, githubData) {
    this.type = type;
    this.githubData = githubData;
    this.startedDate = new Date();
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
    };

    if (this.stoppedDate) {
      build.stoppedDate = this.stoppedDate;
    }

    if (this.code) {
      build.code = this.code;
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

  // Set up a build log cache
  build.cache = new streamBuffers.WritableStreamBuffer();

  // As data gets added to the build log, cache it
  build.out.on('data', (data) => build.cache.write(data));
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

module.exports.buildLogHandler = function (buildName) {
  if (!(buildName === 'current' || buildName === 'previous')) {
    throw new Error(`invalid build name: ${buildName}`);
  }

  return function handleLog(req, res, next) {
    const build = builds[buildName];

    if (!build) {
      next(createError(404, 'no build log found'));
      return;
    }

    const { out, cache } = build;

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the cached build log, which is either everything, or everything so far
    const cached = cache.getContents();
    if (cached) {
      res.write(cached);
    }

    // If we don't have a build happening, we're done
    if (!out) {
      res.end();
      return;
    }

    // Otherwise stream the build output as it comes in
    let onData;
    let onError;
    let onEnd;

    function end(message) {
      if (message) {
        res.write(message);
      }

      out.removeListener('data', onData);
      out.removeListener('error', onError);
      out.removeListener('end', onEnd);

      res.end();
    }

    onData = (data) => res.write(data);
    onError = () => end('Error, end of log.');
    onEnd = () => end('Build Complete.');

    out.on('data', onData);
    out.on('error', onError);
    out.on('end', onEnd);
  };
};
