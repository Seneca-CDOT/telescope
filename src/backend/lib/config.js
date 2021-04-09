const path = require('path');
const dotenv = require('dotenv');

// Try and load our default .env file
const result = dotenv.config();
if (result.error) {
  // Try and use the example env instead if we're not in production
  if (process.env.NODE_ENV !== 'production') {
    const envSamplePath = path.resolve(process.cwd(), path.join('config', 'env.development'));
    const secondAttempt = dotenv.config({ path: envSamplePath });
    if (secondAttempt.error) {
      console.warn(
        `Failed to load .env and ${envSamplePath} env files.\nSee https://github.com/Seneca-CDOT/telescope/blob/master/docs/CONTRIBUTING.md`
      );
    }
  }
}
