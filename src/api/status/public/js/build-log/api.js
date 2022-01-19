// http://localhost:1111/pages/build.html -> http://localhost/deploy/:path
const autodeploymentUrl = (path) => `//${window.location.hostname}/deploy/${path}`;

export const checkBuildStatus = async () => {
  try {
    const res = await fetch(autodeploymentUrl('status'));
    if (!res.ok) {
      throw new Error('unable to get build info');
    }
    const data = await res.json();
    if (!data.current && data.previous) {
      return {
        building: true,
        previous: true,
        title: data.type,
        githubData: data.previous.githubData,
        startedAt: new Date(data.previous.startedDate),
        stoppedAt: new Date(),
        result: data.code,
      };
    }

    if (!data.current) {
      return { building: false };
    }

    return {
      building: true,
      title: data.type,
      githubData: data.current.githubData,
      startedAt: new Date(data.current.startedDate),
      stoppedAt: new Date(),
      result: data.code,
    };
  } catch (err) {
    console.error(err);
    return { building: false };
  }
};

export const getBuildLog = async () => {
  try {
    const res = await fetch(autodeploymentUrl('log'));
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
