import { ListSubheader, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Commits from './Commits';
import Users from './Users';
import useGithubInfo from '../../../hooks/use-genericInfo';

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

const GitHubInfo = () => {
  const classes = useStyles();

  const { repos, issues, commits, pullRequests, users } = useGithubInfo();

  return (
    <ListSubheader component="div" className={classes.root}>
      <div className={classes.GitHubInfoContainer}>
        {!!repos.length && <Repos />}
        {!!issues.length && <Issues />}
        {!!pullRequests.length && <PullRequests />}
        {!!commits.length && <Commits />}
        {!!users.length && <Users />}
      </div>
    </ListSubheader>
  );
};

export default GitHubInfo;
