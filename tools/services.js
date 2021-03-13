/**
 * Various scripts to run docker-compose cross-platform from node.
 */
const dockerCompose = require('docker-compose');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const configDir = path.join(rootDir, 'config');

const defaultOptions = {
  cwd: rootDir,
  log: true,
  composeOptions: ['--env-file', path.join(configDir, 'env.development')],
};

module.exports.start = async (services) => {
  // Start the api service containers, and build any that are out of date
  const defaultWithBuild = { ...defaultOptions, commandOptions: ['--build', '--remove-orphans'] };

  try {
    // If we get a list of services, use that.  Otherwise start them all.
    const { exitCode } = Array.isArray(services)
      ? await dockerCompose.upMany(services, defaultWithBuild)
      : await dockerCompose.upAll(defaultWithBuild);
    process.exit(exitCode);
  } catch (err) {
    console.error(`Error starting services with docker-compose: ${err.message}`);
    process.exit(1);
  }
};

module.exports.stop = async () => {
  // Stop the api service containers
  try {
    const { exitCode } = await dockerCompose.down({
      ...defaultOptions,
      commandOptions: ['--remove-orphans'],
    });
    process.exit(exitCode);
  } catch (err) {
    console.error(`Error stopping services with docker-compose: ${err.message}`);
    process.exit(1);
  }
};

module.exports.logs = async (services) => {
  // Show logs for the specified services (must be specified)
  if (!(typeof services === 'string' || (Array.isArray(services) && services.length > 0))) {
    console.error('Missing services argument');
    process.exit(1);
  }

  try {
    await dockerCompose.logs(services, { ...defaultOptions, follow: true });
  } catch (err) {
    console.error(`Error getting logs for services with docker-compose: ${err.message}`);
    process.exit(1);
  }
};

module.exports.clean = async () => {
  try {
    await dockerCompose.rm(defaultOptions);
  } catch (err) {
    console.error(`Error removing stopped service containers with docker-compose: ${err.message}`);
    process.exit(1);
  }
};
