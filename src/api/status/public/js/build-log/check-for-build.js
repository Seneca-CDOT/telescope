import checkBuildStatus from './check-build-status.js';
import terminal from './terminal.js';
import buildHeader from './build-header.js';
import showToast from '../utils/toast.js';

let build;
let uploaded = false; //a flag to check if build log is added to supabase

const statusUrl = (path) => `http://localhost:1111${path}`;

export default async function checkForBuild() {
  const status = await checkBuildStatus();

  // Prefer the current build, but fallback to the previous one
  const buildData = status.current ?? status.previous;

  if (build && build.sha === buildData.sha) {
    return;
  }

  build = buildData;

  // Render the build header info
  buildHeader(build);

  if (!build) {
    showToast('Build information is missing.', 'warning');
    return;
  }

  const reader = await build.getReader();
  if (!reader) {
    showToast('Reader object from build cannot be retrieved.', 'danger');
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
        terminal.scrollToBottom();
        addBuildLog(value);
        // Recursively invoke processLog until `done === true`
        return processLog();
      })
      .catch(finish);
  };

  const addBuildLog = async (value) => {
    // check if buildLog is already uploaded and if there's no current build, only previous build
    if (uploaded && status.current && !status.previous) {
      return;
    }

    const findResponse = await fetch(statusUrl(`/build/${build.sha}`));
    const buildLog = await findResponse.json();

    //if buildLog is already in supabase
    if (buildLog) {
      return;
    }

    const log = new TextDecoder().decode(value);
    const addResponse = await fetch(statusUrl('/build/add'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sha: build.sha,
        code: build.code,
        log: log,
      }),
    });
    const addMsg = await addResponse.json();
    showToast(`${addMsg}`, 'success');
    uploaded = true;
  };

  // Start processing the log output messages
  terminal.clear();
  processLog();
}
