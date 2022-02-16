import { VscIssues } from 'react-icons/vsc';
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
  const [, user, repo] = issue.split('/');
  return `${user}/${repo}`;
};

const Issues = () => {
  const classes = useStyles();
  const { issues } = useGithubInfo();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscIssues className={classes.icon} />
        {issues.length === 1 ? 'Issue' : 'Issues'}
      </h2>
      <ul className={classes.issues}>
        {issues.map((issue) => (
          <li key={issue} className={classes.issue}>
            <a
              href={`https://github.com${issue}`}
              target="_blank"
              rel="noreferrer"
              title={`${getIssueInfo(issue)} Issue #${getIssueNumber(issue)}`}
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
