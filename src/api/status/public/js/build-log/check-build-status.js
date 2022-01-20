// Get the proper URL for the autodeployment server based on how this is
// being loaded. On staging and production, remove the `api.` subdomain.
// On localhost:1111, use localhost (drop the port).
const autodeploymentUrl = (path) =>
  `//${window.location.hostname.replace('.api', '')}/deploy${path}`;

const getBuildLog = async (buildName) => {
  if (!(buildName === 'current' || buildName === 'previous')) {
    throw new Error(`invalid build name: ${buildName}`);
  }

  try {
    const res = await fetch(autodeploymentUrl(`/log/${buildName}`));
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('unable to get build log');
    }
    return res.body.getReader();
  } catch (err) {
    console.warn(err);
    return null;
  }
};

const decorateBuild = (build, readerFn, isCurrent = false) => {
  if (!build) {
    return;
  }
  build.isCurrent = isCurrent;
  build.getReader = readerFn;
};

export default async () => {
  try {
    const res = await fetch(autodeploymentUrl('/status'));
    if (!res.ok) {
      throw new Error('unable to get build info');
    }
    const data = await res.json();

    // Decorate builds with extra properties
    decorateBuild(data.previous, () => getBuildLog('previous'));
    decorateBuild(data.current, () => getBuildLog('current'), true);

    return data;
  } catch (err) {
    console.error(err);
    return { previous: null, current: null, pending: null };
  }
};
