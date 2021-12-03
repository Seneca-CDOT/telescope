/* eslint-disable consistent-return */
import { checkBuildStatus, getBuildLog } from './api.js';
import terminal from './terminal.js';
import buildHeader from './build-header.js';
import calculatorBuildInfo from './datetime-calculator.js';

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
    terminal.write(value);
  }

  // Recursively invoke processLog until `done === true`
  return reader.read().then(processLog).catch(finish);
}

export default async function checkForBuild() {
  const status = await checkBuildStatus();
  buildHeader(status);
  calculatorBuildInfo(status);

  // If we're already building, skip this check
  if (build) {
    return;
  }

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
