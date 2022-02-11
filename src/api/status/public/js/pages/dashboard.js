import getAllServicesStatus from '../serviceStatus.js';
import './main.js';
import '../../assets/js/demo-chart.cjs';

window.addEventListener('load', () => {
  getAllServicesStatus();
});
