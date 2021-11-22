import {
  createStyles,
  makeStyles,
  Theme,
  ListSubheader,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import Repos from './Repos';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Commits from './Commits';
import Users from './Users';
import { filterGitHubUrls } from './GitHubInfo';
import { VscGithub, VscTriangleDown, VscEllipsis } from 'react-icons/vsc';

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
    icon: {
      fontSize: '4rem',
      marginRight: '1rem',
      paddingLeft: '6rem',
      textAlign: 'right',
    },
    accordionSummary: {
      width: '10rem',
      paddingRight: '0',
      justifyContent: 'flex-end',
    },
    accordion: {
      backgroundColor: 'inherit',
      border: 'none',
      boxShadow: 'none',
    },
  })
);

type Props = {
  ghUrls: string[];
};

const GitHubMobile = ({ ghUrls }: Props) => {
  const classes = useStyles();
  const { repos, issues, pullRequests, commits, users } = filterGitHubUrls(ghUrls);

  return (
    <div>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.accordionSummary}>
          <VscEllipsis className={classes.icon}></VscEllipsis>
        </AccordionSummary>
        <AccordionDetails>
          <ListSubheader className={classes.root}>
            <div className={classes.GitHubInfoContainer}>
              {!!repos.length && <Repos repoUrls={repos} />}
              {!!issues.length && <Issues issueUrls={issues} />}
              {!!pullRequests.length && <PullRequests prUrls={pullRequests} />}
              {!!commits.length && <Commits commitUrls={commits} />}
              {!!users.length && <Users usernames={users} />}
            </div>
          </ListSubheader>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default GitHubMobile;
