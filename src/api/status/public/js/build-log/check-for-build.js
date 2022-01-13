import checkBuildStatus from './check-build-status.js';
import terminal from './terminal.js';
import buildHeader from './build-header.js';

export default async function checkForBuild() {
  const status = await checkBuildStatus();

  // Prefer the current build, but fallback to the previous one
  const build = status.current ?? status.previous;

  // Render the build header info
  buildHeader(build);

  if (!build) {
    return;
  }

  const reader = await build.getReader();
  if (!reader) {
    return;
  }

  const finish = async () => {
    try {
      await reader.cancel();
    } catch (err) {
      console.warn('Unable to clean up build log reader');
    }
  };

  const processLog = () => {
    reader
      .read()
      .then(({ done, value }) => {
        if (done) {
          return finish();
        }
        // Write the data to the terminal
        terminal.write(value);
        // Recursively invoke processLog until `done === true`
        return processLog();
      })
      .catch(finish);
  };

  // Start processing the log output messages
  terminal.clear();
  processLog();
}
