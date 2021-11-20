import {
  createStyles,
  makeStyles,
  Theme,
  ListSubheader,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Commits from './Commits';
import Users from './Users';
import { VscGithub } from 'react-icons/vsc';

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
    icon: {
      fontSize: '4rem',
      marginRight: '1rem',
      paddingLeft: '6rem',
      textAlign: 'right',
    },
    accordionSummary: {
      width: '10rem',
      paddingRight: '0',
      justifyContent: 'flex-end',
    },
    accordion: {
      backgroundColor: 'inherit',
      border: 'none',
      boxShadow: 'none',
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
  const users: Set<string> = new Set();

  const ghUrls = urls.map((url) => parseGitHubUrl(url)).filter((url) => url !== null) as URL[];

  for (const url of ghUrls) {
    const { pathname } = url;

    // Match urls that start with /<user>/<repo>, and optionally end with /<anything-in-between>/<type>/<id>
    // <id> can be number, or a mixed of 40 alphanumeric (commit id)
    // Ex: /Seneca-CDOT/telescope/pull/2367 ✅
    // Ex: /Seneca-CDOT/telescope ✅
    // Ex: /Seneca-CDOT/telescope/pull/2367/commits/d3fagd3fagd3fagd3fagd3fagd3fag4d41265748 ✅
    // Ex: /Seneca-CDOT/telescope/issues ✅
    const matches = /^\/(?<user>[^\/]+)\/(?<repo>[^\/]+)((\/(.*))?\/(?<type>[^\/]+)\/(?<id>(\d+|\w{40}))\/?$)?/i.exec(
      pathname
    );
    if (matches?.groups === undefined) {
      continue;
    }
    const { type, user, repo } = matches.groups;

    const repoUrl = `${user}/${repo}`;
    repos.add(repoUrl);
    users.add(user);
    switch (type?.toLowerCase()) {
      case 'pull':
        pullRequests.add(pathname);
        break;

      case 'issues':
        issues.add(pathname);
        break;

      case 'commit':
      case 'commits':
        commits.add(pathname);
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
    users: Array.from(users),
  };
};

const parseGitHubUrl = (url: string): URL | null => {
  try {
    const ghUrl = new URL(url);
    if (ghUrl.hostname !== 'github.com') {
      return null;
    }
    return ghUrl;
  } catch (err) {
    return null;
  }
};

const GitHubMobile = ({ ghUrls }: Props) => {
  const classes = useStyles();
  const { repos, issues, pullRequests, commits, users } = filterGitHubUrls(ghUrls);

  return (
    <div>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.accordionSummary}>
          <VscGithub className={classes.icon}></VscGithub>
        </AccordionSummary>
        <AccordionDetails>
          <ListSubheader className={classes.root}>
            <div className={classes.GitHubInfoContainer}>
              {!!repos.length && <Repos repoUrls={repos} />}
              {!!issues.length && <Issues issueUrls={issues} />}
              {!!pullRequests.length && <PullRequests prUrls={pullRequests} />}
              {!!commits.length && <Commits commitUrls={commits} />}
              {!!users.length && <Users usernames={users} />}
            </div>
          </ListSubheader>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default GitHubMobile;
