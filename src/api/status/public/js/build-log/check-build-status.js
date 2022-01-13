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

export default async () => {
  try {
    const res = await fetch(autodeploymentUrl('/status'));
    if (!res.ok) {
      throw new Error('unable to get build info');
    }
    const data = await res.json();

    // Decorate builds with a getReader() function
    if (data.previous) {
      data.current.isCurrent = false;
      data.previous.getReader = () => getBuildLog('previous');
    }
    if (data.current) {
      data.current.isCurrent = true;
      data.current.getReader = () => getBuildLog('current');
    }

    return data;
  } catch (err) {
    console.error(err);
    return { previous: null, current: null, pending: null };
  }
};
