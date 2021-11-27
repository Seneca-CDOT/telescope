import getPostsCount from '../post/index';
import getFeedCount from '../feed/index';
import getGitHubData from '../github-stats';

window.addEventListener('load', () => {
  getGitHubData('Seneca-CDOT', 'telescope');
  getGitHubData('Seneca-CDOT', 'satellite');
  getFeedCount();
  getPostsCount();
});
