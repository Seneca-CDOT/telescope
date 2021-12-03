import checkForBuild from '../build-log/check-for-build.js';
import calculatorBuildInfo from '../build-log/datetime-calculator.js';

window.addEventListener('load', () => {
  checkForBuild();
  setInterval(calculatorBuildInfo, 1000);
  setInterval(checkForBuild, 5000);
});
