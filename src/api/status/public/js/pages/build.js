import checkForBuild from '../build-log/check-for-build.js';
import './main.js';

window.addEventListener('load', () => {
  checkForBuild();
  setInterval(checkForBuild, 10000);
});
