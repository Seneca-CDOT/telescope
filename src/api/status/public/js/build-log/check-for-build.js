import { checkBuildStatus, getBuildLog } from './api.js';
import terminal from './terminal.js';
let build, reader;

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
    terminal.write(value);
  }
}

export async function checkForBuild() {
  // If we're already building, skip this check
  if (build) {
    return;
  }

  const status = await checkBuildStatus();
  if (status.building) {
    terminal.clear();
    reader = await getBuildLog();
    if (reader) {
      build = { reader, title: status.title, startedAt: status.startedAt };
      reader.read().then(processLog).catch(finish);
    }
  }
}
