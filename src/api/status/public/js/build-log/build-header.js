const buildHeaderTitle = document.getElementById('build-header-title');
const buildHeaderInfo = document.getElementById('build-header-info');
const buildSender = document.getElementById('build-sender');
const buildSenderName = document.getElementById('build-sender-name');
const buildSenderImg = document.getElementById('build-sender-img');
const buildGitSHA = document.getElementById('build-git-sha');
const buildResult = document.getElementById('build-result');
const buildStarted = document.getElementById('build-started');
const buildDuration = document.getElementById('build-duration');
const buildPrevious = document.getElementById('previous-build');

function renderBuildInfo({ githubData, startedAt, stoppedAt, result, previous }) {
  if (buildHeaderInfo.hidden) {
    buildHeaderInfo.removeAttribute('hidden');
  }
  if (previous) {
    buildPrevious.innerText = 'Previous Build';
  }

  buildHeaderTitle.innerHTML = '';
  buildSender.href = githubData.sender.html_url;
  buildSenderName.innerText = githubData.sender.login;
  buildSenderImg.src = githubData.sender.avatar_url;
  buildGitSHA.href = githubData.compare;
  buildGitSHA.innerText = githubData.after.substring(0, 7);
  buildResult.innerText = result === 0 ? 'Good' : 'Error';
  buildStarted.innerText = new Date(startedAt).toUTCString();

  const duration = new Date(stoppedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  buildDuration.innerText = `${minutes}m ${seconds}s`;
}

export default function buildHeader(data) {
  if (!data.building) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-server px-2';
    buildHeaderTitle.innerHTML = '';
    buildHeaderTitle.append(icon);
    buildHeaderTitle.innerHTML += 'There is no current or previous build at the moment.';
    buildHeaderInfo.innerHTML = '';
    return;
  }
  renderBuildInfo(data);
}
