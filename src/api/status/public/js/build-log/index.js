import { checkForBuild } from './check-for-build.js';

checkForBuild();
setInterval(checkForBuild, 5000);
