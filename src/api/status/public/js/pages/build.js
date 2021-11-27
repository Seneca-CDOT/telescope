import { checkForBuild } from '../build-log/check-for-build';

window.addEventListener('load', () => {
  checkForBuild();
  setInterval(checkForBuild, 5000);
});
