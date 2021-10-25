const { logger, createError } = require('@senecacdot/satellite');
const shell = require('shelljs');
const mergeStream = require('merge-stream');

class Build {
  constructor(type, githubData) {
    this.type = type;
    this.githubData = githubData;
    this.startedDate = new Date();
  }

  finish(code) {
    logger.debug({ code }, 'build finished');
    this.stopDate = new Date();
    this.code = code;

    // Drop the output stream
    if (this.out) {
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

    if (this.stopDate) {
      build.stopDate = this.stopDate;
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

module.exports.buildLogHandler = function handleLog(req, res, next) {
  const build = builds.current;
  if (!(build && build.out)) {
    next(createError(404, 'no build log found'));
    return;
  }

  const { out } = build;

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  const onData = (data) => res.write(data);
  const onError = () => end('Error, end of log.');
  const onEnd = () => end('Build Complete.');

  function end(message) {
    if (message) {
      res.write(message);
    }

    out.removeListener('data', onData);
    out.removeListener('error', onError);
    out.removeListener('end', onEnd);

    res.end();
  }

  out.on('data', onData);
  out.on('error', onError);
  out.on('end', onEnd);
};
