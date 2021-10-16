import { VscGitPullRequest } from 'react-icons/vsc';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    GitHubInfo: {
      lineHeight: '2rem',
      fontSize: '1.2rem',
      wordWrap: 'break-word',
    },
    GitHubLinkTitle: {
      fontSize: '1.4rem',
      margin: 0,
      paddingTop: '1rem',
    },
    icon: {
      fontSize: '2rem',
      marginRight: '1rem',
      verticalAlign: 'text-bottom',
    },
  })
);

type Props = {
  repoUrls: string[];
};

const Repos = ({ repoUrls }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h1 className={classes.GitHubLinkTitle}>
        <VscGitPullRequest className={classes.icon}></VscGitPullRequest>
        {repoUrls.length === 1 ? 'Repo' : 'Repos'}
      </h1>
      {repoUrls.map((repo) => (
        <p key={repo}>
          <a href={repo} rel="bookmark" className={classes.link}>
            {repo.replace(/https:\/\/github\.com\//, '')}
          </a>
        </p>
      ))}
    </div>
  );
};

export default Repos;
