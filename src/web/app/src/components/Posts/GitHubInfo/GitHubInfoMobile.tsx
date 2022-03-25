import { createStyles, makeStyles, Theme, ListSubheader } from '@material-ui/core';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Commits from './Commits';
import Users from './Users';
import { useGithubInfo } from '../../../hooks/use-genericInfo';

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

const GitHubInfoMobile = () => {
  const classes = useStyles();
  const { repos, issues, pullRequests, commits, users } = useGithubInfo();

  return (
    <div>
      <ListSubheader className={classes.root}>
        <div className={classes.GitHubInfoContainer}>
          {!!repos.length && <Repos />}
          {!!issues.length && <Issues />}
          {!!pullRequests.length && <PullRequests />}
          {!!commits.length && <Commits />}
          {!!users.length && <Users />}
        </div>
      </ListSubheader>
    </div>
  );
};

export default GitHubInfoMobile;
