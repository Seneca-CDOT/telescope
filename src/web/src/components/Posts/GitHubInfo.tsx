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

const filterGitHubUrls = (ghUrls: string[]) => {
  const issues: string[] = [];
  const pullRequests: string[] = [];
  const repos: string[] = [];

  ghUrls.forEach((ghUrl) => {
    // add unique repo urls to repos array
    if (
      ghUrl.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+/) &&
      !repos.includes(ghUrl.replace(/(https:\/\/github\.com\/[^\/]+\/[^\/]+)\/.*/, '$1'))
    ) {
      repos.push(ghUrl.replace(/(https:\/\/github\.com\/[^\/]+\/[^\/]+)\/.*/, '$1'));
    }

    // remove trailing characters after issue or pullRequest number from ghUrl
    const trimmedUrl: string = ghUrl.replace(
      /(https:\/\/github\.com\/[^\/]+\/[^\/]+\/(issues|pull)\/[0-9]+).*/,
      '$1'
    );

    // add unique issue urls to issues array
    if (trimmedUrl.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/[0-9]+/)) {
      if (!issues.includes(trimmedUrl)) issues.push(trimmedUrl);
    }

    // add unique pull request urls to pullRequests array
    if (trimmedUrl.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/[0-9]+/)) {
      if (!pullRequests.includes(trimmedUrl)) pullRequests.push(trimmedUrl);
    }
  });
  return { repos, issues, pullRequests };
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
