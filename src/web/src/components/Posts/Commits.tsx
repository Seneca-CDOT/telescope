import { VscGitCommit } from 'react-icons/vsc';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import useGithubInfo from '../../hooks/use-githubInfo';

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
      lineHeight: 'normal',
      fontSize: '1.2rem',
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
    commits: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
    },
    commit: {
      listStyle: 'none',
    },
  })
);

const SHORT_SHA_LENGTH = 7;

const getCommitNumber = (url: string, length?: number) =>
  url.replace(/.+\/(commit|commits)\/(\w{40}).*/, '$2').substr(0, length);

const getCommitInfo = (commit: string) => {
  const [, user, repo] = commit.split('/');
  return `${user}/${repo}`;
};

const Commits = () => {
  const classes = useStyles();
  const { commits } = useGithubInfo();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscGitCommit className={classes.icon} />
        {commits.length === 1 ? 'Commit' : 'Commits'}
      </h2>
      <ul className={classes.commits}>
        {commits.map((url) => (
          <li key={url} className={classes.commit}>
            <a
              href={`https://github.com${url}`}
              target="_blank"
              rel="noreferrer"
              title={`${getCommitInfo(url)} Commit ${getCommitNumber(url)}`}
              className={classes.link}
            >
              {getCommitNumber(url, SHORT_SHA_LENGTH)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Commits;
