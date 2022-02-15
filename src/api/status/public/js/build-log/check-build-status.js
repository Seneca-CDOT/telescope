import showToast from '../utils/toast.js';

// Get the proper URL for the autodeployment server based on how this is
// being loaded. On staging and production, remove the `api.` subdomain.
// On localhost:1111, use localhost (drop the port).
const autodeploymentUrl = (path) =>
  `//${window.location.hostname.replace(/(api\.|\.api)/, '')}/deploy${path}`;

const getBuildLog = async (buildName) => {
  if (!(buildName === 'current' || buildName === 'previous')) {
    showToast('Build name is invalid.', 'danger');
    throw new Error(`invalid build name: ${buildName}`);
  }

  try {
    const res = await fetch(autodeploymentUrl(`/log/${buildName}`));
    if (!res.ok) {
      if (res.status === 404) {
        showToast('Build log is not found.', 'danger');
        return null;
      }
      showToast('Build log cannot be fetched due to an unknown error.', 'danger');
      throw new Error('unable to get build log');
    }
    return res.body.getReader();
  } catch (err) {
    console.warn(err);
    showToast('An error occurred while trying to read the log.', 'warning');
    return null;
  }
};

const decorateBuild = (build, readerFn, isCurrent = false) => {
  if (!build) {
    showToast('Build is missing (decorateBuild function).', 'warning');
    return;
  }
  build.isCurrent = isCurrent;
  build.getReader = readerFn;
};

export default async () => {
  try {
    const res = await fetch(autodeploymentUrl('/status'));
    if (!res.ok) {
      showToast('Build information cannot be fetched.', 'danger');
      throw new Error('unable to get build info');
    }
    const data = await res.json();

    // Decorate builds with extra properties
    decorateBuild(data.previous, () => getBuildLog('previous'));
    decorateBuild(data.current, () => getBuildLog('current'), true);

    return data;
  } catch (err) {
    console.error(err);
    showToast('Build log cannot be read due to an unknown error.', 'danger');
    return { previous: null, current: null, pending: null };
  }
};
