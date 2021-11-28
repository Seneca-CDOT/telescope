/* eslint-disable consistent-return */
import { checkBuildStatus, getBuildLog } from './api.js';
import terminal from './terminal.js';

let build;
let reader;

async function finish() {
  try {
    await reader.cancel();
  } finally {
    build = null;
  }
}

function processLog({ done, value }) {
  if (done) {
    return finish();
  }

  if (terminal) {
    return terminal.write(value);
  }
}

export default async function checkForBuild() {
  // If we're already building, skip this check
  if (build) {
    return;
  }

  const status = await checkBuildStatus();
  if (status.building) {
    terminal.clear();
    reader = await getBuildLog();
    if (reader) {
      // eslint-disable-next-line require-atomic-updates
      build = { reader, title: status.title, startedAt: status.startedAt };
      reader.read().then(processLog).catch(finish);
    }
  }
}
