import { VscRepoForked } from 'react-icons/vsc';
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

type Props = {
  prUrls: string[];
};

const PullRequests = ({ prUrls }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h1 className={classes.GitHubLinkTitle}>
        <VscRepoForked className={classes.icon}></VscRepoForked>
        {prUrls.length === 1 ? 'Pull Request' : 'Pull Requests'}
      </h1>
      <p className={classes.pullRequests}>
        {prUrls.map((pullRequest) => (
          <p key={pullRequest} className={classes.pullRequest}>
            <a href={pullRequest} rel="bookmark" className={classes.link}>
              #{pullRequest.replace(/https:\/\/github\.com\/.+\/pull\/([0-9]+).*/, '$1')}
            </a>
          </p>
        ))}
      </p>
    </div>
  );
};

export default PullRequests;
