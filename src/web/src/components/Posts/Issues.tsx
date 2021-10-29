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
    issues: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
    },
    issue: {
      listStyle: 'none',
    },
  })
);

const getIssueNumber = (issue: string) => issue.replace(/.+\/issues\/([0-9]+).*/, '$1');

const getIssueInfo = (issue: string) => {
  const removeSlashes = issue.split('/');
  const user = removeSlashes[1],
    repo = removeSlashes[2];
  return `${user}/${repo}`;
};

type Props = {
  issueUrls: string[];
};

const Issues = ({ issueUrls }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscIssues className={classes.icon}></VscIssues>
        {issueUrls.length === 1 ? 'Issue' : 'Issues'}
      </h2>
      <ul className={classes.issues}>
        {issueUrls.map((issue) => (
          <li key={issue} className={classes.issue}>
            <a
              href={`https://github.com${issue}`}
              rel="bookmark"
              target="_blank"
              title={`Issue from ${getIssueInfo(issue)}, with an issue value of #${getIssueNumber(
                issue
              )}`}
              className={classes.link}
            >
              #{getIssueNumber(issue)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Issues;
