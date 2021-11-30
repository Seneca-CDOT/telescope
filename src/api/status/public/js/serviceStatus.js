const reportTbody = () => document.querySelector('#report');
const requestMessageReport = () => document.querySelector('#request-message');

// Create td for service name
const createTdText = (content) => {
  const td = document.createElement('td');
  const div = document.createElement('div');
  const h6 = document.createElement('h6');

  h6.className = 'text-capitalize mb-0 text-sm';
  h6.innerHTML = content;
  div.className = 'text-start px-2 py-1';
  div.appendChild(h6);
  td.appendChild(div);

  return td;
};

// Create td for icon
const createTdIcon = (status) => {
  const td = document.createElement('td');
  const icon = document.createElement('i');

  td.className = 'align-middle text-center';
  icon.title = status;
  icon.className =
    status >= 200 && status <= 299
      ? 'text-lg text-success fas fa-check-circle'
      : 'text-lg text-danger fas fa-exclamation-circle';

  td.appendChild(icon);

  return td;
};

// Create row of the table
const serviceRowFormat = (result) => {
  const {
    name,
    status: { staging, production },
  } = result;
  const tr = document.createElement('tr');

  tr.appendChild(createTdText(name));
  tr.appendChild(createTdIcon(staging));
  tr.appendChild(createTdIcon(production));
  reportTbody().appendChild(tr);
};

export default function getAllServicesStatus() {
  fetch('/v1/status/status')
    .then((res) => {
      if (res.ok) return res.json();

      const messageReport = requestMessageReport();
      if (messageReport) {
        messageReport.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = 'fas fa-server px-2';
        messageReport.appendChild(icon);
        messageReport.innerHTML += `${res.status} Unable to get API status.`;
      }
      throw new Error('unable to get API status');
    })
    .then((results) => {
      reportTbody().innerHTML = '';
      results.forEach((result) => serviceRowFormat(result));
      return setTimeout(getAllServicesStatus, 5000);
    })
    .catch((err) => console.error(err));
}
