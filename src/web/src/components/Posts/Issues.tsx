import { VscIssues } from 'react-icons/vsc';
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
    issues: {
      display: 'flex',
      margin: 0,
    },
    issue: {
      marginRight: '2rem',
    },
  })
);

const getIssueNumber = (issue: string) => {
  return issue.replace(/.+\/issues\/([0-9]+).*/, '$1');
};

type Props = {
  issueUrls: string[];
};

const Issues = ({ issueUrls }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h1 className={classes.GitHubLinkTitle}>
        <VscIssues className={classes.icon}></VscIssues>
        {issueUrls.length === 1 ? 'Issue' : 'Issues'}
      </h1>
      <p className={classes.issues}>
        {issueUrls.map((issue) => (
          <p key={issue} className={classes.issue}>
            <a
              href={`https://github.com${issue}`}
              rel="bookmark"
              target="_blank"
              title={'Issue #' + getIssueNumber(issue)}
              className={classes.link}
            >
              #{getIssueNumber(issue)}
            </a>
          </p>
        ))}
      </p>
    </div>
  );
};

export default Issues;
