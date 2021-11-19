const fetchGitHubApi = (owner, repo, path) =>
  fetch(`https://api.github.com/repos/${owner}/${repo}/${path}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

const getGitHubData = (owner, repo) => {
  let weeklyCommits = 0;

  // get weekly commits for last year: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-count
  fetchGitHubApi(owner, repo, 'stats/participation')
    .then((res) => res.json())
    .then((data) => {
      weeklyCommits = data.all[data.all.length - 1];
      document.getElementById(`weekly-commits-${repo}`).innerHTML = weeklyCommits;

      document.getElementById(`yearly-commits-${repo}`).innerHTML = data.all.reduce(
        (a, b) => a + b
      );
    })
    .catch((error) => console.log(error));

  // get weekly commits activity: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-activity
  fetchGitHubApi(owner, repo, 'stats/code_frequency')
    .then((res) => res.json())
    .then((data) => {
      if (weeklyCommits) {
        document.getElementById(`lines-added-${repo}`).innerHTML = data[data.length - 1][1];
        document.getElementById(`lines-removed-${repo}`).innerHTML = data[data.length - 1][2];
      } else {
        document.getElementById(`new-lines-${repo}`).innerHTML =
          '<p class="mb-0">No commits this week<p/>';
      }
    })
    .catch((error) => console.log(error));

  // get latest author from commits list: https://docs.github.com/en/rest/reference/repos#list-commits
  fetchGitHubApi(owner, repo, 'commits')
    .then((res) => res.json())
    .then((data) => {
      const avatar = data[0].author.avatar_url;
      const username = data[0].author.login;
      const fullName = data[0].commit.author.name;

      document.getElementById(`latest-author-image-${repo}`).src = avatar;
      document.getElementById(`latest-author-image-${repo}`).alt = username;
      document.getElementById(`latest-author-${repo}`).innerHTML = fullName;
      document.getElementById(`latest-author-${repo}`).title = username;
      document.getElementById(`latest-author-${repo}`).href = `https://github.com/${username}`;
      document.getElementById(`latest-author-link-${repo}`).title = username;
      document.getElementById(`latest-author-link-${repo}`).href = `https://github.com/${username}`;
    })
    .catch((error) => console.log(error));

  // get total contributors: https://docs.github.com/en/rest/reference/repos#list-repository-contributors
  fetchGitHubApi(owner, repo, 'contributors?per_page=1')
    .then((res) => res.headers.get('link'))
    .then((data) => {
      const contributors = data.match(/.*"next".*&page=([0-9]*).*"last".*/)[1];
      document.getElementById(`total-contributors-${repo}`).innerHTML = contributors;
    })
    .catch((error) => console.log(error));
};

document.addEventListener('DOMContentLoaded', () => {
  getGitHubData('Seneca-CDOT', 'telescope');
  getGitHubData('Seneca-CDOT', 'satellite');
});
