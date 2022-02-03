import { VscRepoForked } from 'react-icons/vsc';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import useGithubInfo from '../../../hooks/use-githubInfo';

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
      fontSize: '1.2rem',
      wordWrap: 'break-word',
      lineHeight: 'normal',
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
    repos: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
    },
    repo: {
      listStyle: 'none',
    },
  })
);

const getRepoName = (repo: string) => repo.replace(/^([^/]+\/[^/]+).*/, '$1');

const Repos = () => {
  const classes = useStyles();
  const { repos } = useGithubInfo();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscRepoForked className={classes.icon} />
        {repos.length === 1 ? 'Repo' : 'Repos'}
      </h2>
      <ul className={classes.repos}>
        {repos.map((repo) => (
          <li key={repo} className={classes.repo}>
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noreferrer"
              title={repo}
              className={classes.link}
            >
              {getRepoName(repo)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repos;
