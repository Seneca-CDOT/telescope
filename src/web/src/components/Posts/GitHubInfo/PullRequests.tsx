import { VscGitPullRequest } from 'react-icons/vsc';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import useGithubInfo from '../../../hooks/use-genericInfo';

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
    pullRequests: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
    },
    pullRequest: {
      listStyle: 'none',
    },
  })
);

const getPullRequestNumber = (pullRequest: string) =>
  pullRequest.replace(/.+\/pull\/([0-9]+).*/, '$1');

const getPullRequestInfo = (pullRequest: string) => {
  const [, user, repo] = pullRequest.split('/');
  return `${user}/${repo}`;
};

const PullRequests = () => {
  const classes = useStyles();

  const { pullRequests } = useGithubInfo();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscGitPullRequest className={classes.icon} />
        {pullRequests.length === 1 ? 'Pull Request' : 'Pull Requests'}
      </h2>
      <ul className={classes.pullRequests}>
        {pullRequests.map((pullRequest) => (
          <li key={pullRequest} className={classes.pullRequest}>
            <a
              href={`https://github.com${pullRequest}`}
              target="_blank"
              rel="noreferrer"
              title={`${getPullRequestInfo(pullRequest)} Pull Request #${getPullRequestNumber(
                pullRequest
              )}`}
              className={classes.link}
            >
              #{getPullRequestNumber(pullRequest)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PullRequests;
