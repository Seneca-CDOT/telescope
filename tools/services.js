/**
 * Various scripts to run docker-compose cross-platform from node.
 */
const dockerCompose = require('docker-compose');
const { constants, promises: fs } = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '..', 'src', 'api');

/**
 * Make sure we have an .env file in src/api
 */
const envFileExists = async () => {
  try {
    await fs.access(path.join(apiPath, '.env'), constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

/**
 * Copy the env.development file to src/api/.env
 */
const ensureDefaultEnvFile = async () => {
  if (!(await envFileExists())) {
    const developmentEnvFile = path.join(apiPath, 'env.development');
    const envFile = path.join(apiPath, '.env');
    await fs.copyFile(developmentEnvFile, envFile);
    console.log(`Created default env file at ${envFile} using ${developmentEnvFile}`);
  }
};

module.exports.start = async (services) => {
  // Make sure we have an .env file.  If we don't, copy the development one
  ensureDefaultEnvFile();

  // Start the api service containers
  try {
    const options = {
      cwd: apiPath,
      log: true,
    };
    // If we get a list of services, use that.  Otherwise start them all.
    const { exitCode } = Array.isArray(services)
      ? await dockerCompose.upMany(services, options)
      : await dockerCompose.upAll(options);
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
      cwd: apiPath,
      log: true,
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
    await dockerCompose.logs(services, { cwd: apiPath, follow: true, log: true });
  } catch (err) {
    console.error(`Error getting logs for services with docker-compose: ${err.message}`);
    process.exit(1);
  }
};

module.exports.clean = async () => {
  try {
    await dockerCompose.rm({ cwd: apiPath, log: true });
  } catch (err) {
    console.error(`Error removing stopped service containers with docker-compose: ${err.message}`);
    process.exit(1);
  }
};
