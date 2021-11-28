import checkForBuild from '../build-log/check-for-build.js';

window.addEventListener('load', () => {
  checkForBuild();
  setInterval(checkForBuild, 5000);
});
