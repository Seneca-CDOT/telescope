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
      display: 'flex',
      margin: 0,
    },
    pullRequest: {
      marginRight: '2rem',
    },
  })
);

const getPullRequestNumber = (pullRequest: string) => {
  return pullRequest.replace(/.+\/pull\/([0-9]+).*/, '$1');
};

type Props = {
  prUrls: string[];
};

const PullRequests = ({ prUrls }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h1 className={classes.GitHubLinkTitle}>
        <VscGitPullRequest className={classes.icon}></VscGitPullRequest>
        {prUrls.length === 1 ? 'Pull Request' : 'Pull Requests'}
      </h1>
      <p className={classes.pullRequests}>
        {prUrls.map((pullRequest) => (
          <p key={pullRequest} className={classes.pullRequest}>
            <a
              href={pullRequest}
              rel="bookmark"
              target="_blank"
              title={'Pull Request #' + getPullRequestNumber(pullRequest)}
              className={classes.link}
            >
              #{getPullRequestNumber(pullRequest)}
            </a>
          </p>
        ))}
      </p>
    </div>
  );
};

export default PullRequests;
