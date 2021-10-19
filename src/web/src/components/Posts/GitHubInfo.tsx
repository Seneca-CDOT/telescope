import { createStyles, makeStyles, Theme, ListSubheader } from '@material-ui/core';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      display: 'flex',
      borderLeft: '1.5px solid #999999',
      flexDirection: 'column',
      [theme.breakpoints.up('lg')]: {
        width: '21rem',
      },
      color: theme.palette.text.secondary,
    },
    GitHubInfoContainer: {
      margin: '2rem 0 0 1rem',
    },
  })
);

type Props = {
  ghUrls: string[];
};

const filterGitHubUrls = (urls: string[]) => {
  const issues: Set<string> = new Set();
  const pullRequests: Set<string> = new Set();
  const repos: Set<string> = new Set();
  const commits: Set<string> = new Set();

  const ghUrls = urls.map((url) => parseGitHubUrl(url)).filter((url) => url !== null) as URL[];

  for (const url of ghUrls) {
    const { pathname, href } = url;

    // Match urls that start with /<user>/<repo>, and optionally end with /<anything-in-between>/<type>/<id>
    // Ex: /Seneca-CDOT/telescope/pull/2367 ✅
    // Ex: /Seneca-CDOT/telescope ✅
    // Ex: /Seneca-CDOT/telescope/pull/2367/commits/d3fag ✅
    // Ex: /Seneca-CDOT/telescope/issues ✅
    const matches = /^\/(?<user>[^\/]+)\/(?<repo>[^\/]+)((\/(.*))?\/(?<type>[^\/]+)\/(?<id>(\w+))$)?/i.exec(
      pathname
    );
    if (matches?.groups === undefined) {
      continue;
    }
    const { type, user, repo } = matches.groups;

    const repoUrl = `https://github.com/${user}/${repo}`;
    repos.add(repoUrl);
    switch (type?.toLowerCase()) {
      case 'pull':
        pullRequests.add(href);
        break;

      case 'issues':
        issues.add(href);
        break;

      case 'commit':
      case 'commits':
        commits.add(href);
        break;

      default:
        break;
    }
  }

  return {
    repos: Array.from(repos),
    issues: Array.from(issues),
    pullRequests: Array.from(pullRequests),
    commits: Array.from(commits),
  };
};

const parseGitHubUrl = (url: string): URL | null => {
  const trimmedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  try {
    const ghUrl = new URL(trimmedUrl);
    if (ghUrl.hostname !== 'github.com') {
      return null;
    }
    return ghUrl;
  } catch (err) {
    return null;
  }
};

const GitHubInfo = ({ ghUrls }: Props) => {
  const classes = useStyles();
  const { repos, issues, pullRequests } = filterGitHubUrls(ghUrls);

  return (
    <ListSubheader className={classes.root}>
      <div className={classes.GitHubInfoContainer}>
        {repos.length ? <Repos repoUrls={repos} /> : null}
        {issues.length ? <Issues issueUrls={issues} /> : null}
        {pullRequests.length ? <PullRequests prUrls={pullRequests} /> : null}
      </div>
    </ListSubheader>
  );
};

export default GitHubInfo;
