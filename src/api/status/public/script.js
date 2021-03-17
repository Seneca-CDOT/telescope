const reportDiv = () => document.querySelector('#report');

function createTd(content) {
  const td = document.createElement('td');
  if (typeof content === 'string') {
    td.innerHTML = content;
  } else {
    td.appendChild(content);
  }
  return td;
}

function createIcon(status) {
  const icon = document.createElement('i');
  icon.title = status;
  if (status >= 200 && status <= 299) {
    icon.className = 'text-success bi bi-check-circle-fill';
  } else {
    icon.className = 'text-danger bi bi-exclamation-circle-fill';
  }
  return icon;
}

function formatResult(result) {
  const tr = document.createElement('tr');
  tr.appendChild(createTd(result.name));
  tr.appendChild(createTd(createIcon(result.status.staging)));
  tr.appendChild(createTd(createIcon(result.status.production)));

  const report = reportDiv();
  report.appendChild(tr);
}

function checkStatus() {
  fetch('/v1/status/status')
    .then((res) => {
      if (!res.ok) {
        throw new Error('unable to get API status');
      }
      return res.json();
    })
    .then((results) => {
      const report = reportDiv();
      report.innerHTML = '';
      results.forEach((result) => formatResult(result));
      return setTimeout(checkStatus, 5000);
    })
    .catch((err) => console.error(err));
}

window.onload = function () {
  checkStatus();
};
