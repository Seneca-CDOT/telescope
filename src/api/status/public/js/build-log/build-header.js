// eslint-disable-next-line import/no-unresolved
import ms from 'https://cdn.jsdelivr.net/npm/@esm/ms@2.1.0/index.js';

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

function renderBuildTimeInfo(startedDate, stoppedDate = new Date()) {
  const duration = new Date(stoppedDate).getTime() - new Date(startedDate).getTime();
  buildDuration.innerText = ms(duration);
  buildStarted.innerText = new Date(startedDate).toUTCString();
}

function renderSender(sender) {
  buildSender.href = sender.html_url;
  buildSenderName.innerText = sender.login;
  buildSenderImg.src = sender.avatar_url;
}

function renderSha(compare, after) {
  buildGitSHA.href = compare;
  buildGitSHA.innerText = after.substring(0, 7);
}

function renderBuildInfo({ isCurrent, githubData, startedDate, stoppedDate, code }) {
  const { sender, after, compare } = githubData;

  if (buildHeaderInfo.hidden) {
    buildHeaderInfo.hidden = false;
  }

  if (!isCurrent) {
    buildPrevious.innerText = 'Previous Build';
  }

  buildHeaderTitle.innerHTML = '';

  renderSender(sender);
  renderSha(compare, after);
  renderBuildTimeInfo(startedDate, stoppedDate);

  buildResult.innerText = code === 0 ? 'Success' : 'Error';
}

export default function buildHeader(build) {
  if (!build) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-server px-2';
    buildHeaderTitle.innerHTML = '';
    buildHeaderTitle.append(icon);
    buildHeaderTitle.innerHTML += 'Unable to get build info at the moment. Please try again later.';
    buildHeaderInfo.innerHTML = '';
    return;
  }

  renderBuildInfo(build);
}
