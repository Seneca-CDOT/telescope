import { createStyles, makeStyles, Theme, ListSubheader } from '@material-ui/core';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Commits from './Commits';
import Users from './Users';
import { filterGitHubUrls } from './GitHubInfo';

type Props = {
  ghUrls: string[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '0',
      lineHeight: '1',
      [theme.breakpoints.up('lg')]: {
        width: '21rem',
      },
      color: theme.palette.text.secondary,
    },
    GitHubInfoContainer: {
      margin: '0 0 0 1rem',
    },
  })
);

const GitHubInfoMobile = ({ ghUrls }: Props) => {
  const classes = useStyles();
  const { repos, issues, pullRequests, commits, users } = filterGitHubUrls(ghUrls);

  return (
    <div>
      <ListSubheader className={classes.root}>
        <div className={classes.GitHubInfoContainer}>
          {!!repos.length && <Repos repoUrls={repos} />}
          {!!issues.length && <Issues issueUrls={issues} />}
          {!!pullRequests.length && <PullRequests prUrls={pullRequests} />}
          {!!commits.length && <Commits commitUrls={commits} />}
          {!!users.length && <Users usernames={users} />}
        </div>
      </ListSubheader>
    </div>
  );
};

export default GitHubInfoMobile;
