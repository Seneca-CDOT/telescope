const [buildDateCaltulator, buildIcon] = [
  document.getElementById('calculatorData'),
  document.getElementById('build-icon'),
];

function calculator(startedAtValue, stoppedAtValue) {
  let diff;
  if (stoppedAtValue === 'null') {
    const date = Math.abs((new Date(startedAtValue).getTime() / 1000).toFixed(0));
    const currentDate = Math.abs((new Date().getTime() / 1000).toFixed(0));
    diff = currentDate - date;
  } else {
    const date = Math.abs((new Date(startedAtValue).getTime() / 1000).toFixed(0));
    const currentDate = Math.abs((new Date(stoppedAtValue).getTime() / 1000).toFixed(0));
    diff = currentDate - date;
  }
  const hours = Math.floor(diff / 3600) % 24;
  const minutes = Math.floor(diff / 60) % 60;
  const seconds = diff % 60;
  return [hours, minutes, seconds];
}

export default function calculatorBuildInfo(data) {
  const [startedAtValue, stoppedAtValue, resultValue] = [
    data.startedAt,
    data.stoppedAt,
    data.result,
  ];
  const timeValue = calculator(startedAtValue, stoppedAtValue);
  const [hoursValue, minutesValue, secondsValue] = [timeValue[0], timeValue[1], timeValue[2]];

  if (startedAtValue !== 'null' && stoppedAtValue === 'null') {
    buildDateCaltulator.innerText = `${hoursValue} h ${minutesValue} m ${secondsValue} s`;
    buildIcon.innerHTML = 'motion_photos_on';
    buildIcon.classList.add('fa-spin', 'text-warning', 'fa-12x');
  } else if (resultValue === 0 && stoppedAtValue !== 'null') {
    buildDateCaltulator.innerText = `${hoursValue} h ${minutesValue} m ${secondsValue} s`;
    buildIcon.innerHTML = 'check_circle';
    buildIcon.classList.add('text-success');
  } else if (resultValue !== 0 && stoppedAtValue !== 'null') {
    buildDateCaltulator.innerText = `${hoursValue} h ${minutesValue} m ${secondsValue} s`;
    buildIcon.innerHTML = 'cancel';
    buildIcon.classList.add('text-danger');
  }
}
