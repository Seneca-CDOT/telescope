import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { Box, Collapse } from '@material-ui/core';
import GitHubIcon from '@mui/icons-material/GitHub';
import { VscIssues } from 'react-icons/vsc';
import FolderIcon from '@mui/icons-material/Folder';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TableCell from '@mui/material/TableCell';
import { FiPackage } from 'react-icons/fi';
import useSWR from 'swr';
import CircularProgress from '@mui/material/CircularProgress';

import { dependencyDiscoveryUrl } from '../../config';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTableCell-body': {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      fontWeight: 700,
    },
    cursor: 'pointer',
  },
  rowTitleIcon: {
    marginRight: '1rem',
    fontSize: '2rem',
  },
  iconRow: {
    textAlign: 'right !important' as 'right',
  },
  icons: {
    color: theme.palette.text.secondary,
    fontSize: '2rem !important',
  },
  dependencyInfo: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: '1rem',
  },
  dependencyInfoIssue: {
    margin: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  dependencyInfoIcon: {
    fontSize: '2rem !important',
    marginRight: '1.5rem',
  },
  issueCard: {
    display: 'flex',
    border: '1px',
    borderColor: theme.palette.text.primary,
    borderStyle: 'solid',
    color: theme.palette.text.primary,
    padding: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  issueCardLink: {
    textDecoration: 'none',
  },
  collapseBox: {
    fontSize: '14px',
    color: theme.palette.text.primary,
    padding: '2rem',
    fontFamily: 'Spartan',
  },
  collapseBoxLoading: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  issueCardTitle: {
    fontWeight: 700,
    fontFamily: 'Spartan',
  },
  colorPrimary: {
    color: theme.palette.text.secondary,
  },
  links: {
    color: theme.palette.primary.main,
  },
}));

type issueInfo = {
  htmlUrl: string;
  title: string;
  body: string;
  createdAt: string;
};

type RowProps = {
  dependency: string;
};

export const Row = ({ dependency }: RowProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [apiLimited, setApiLimited] = useState(false);
  const { data: projectInfo } = useSWR(
    open ? `${dependencyDiscoveryUrl}/projects/${dependency}` : null
  );
  const { data: issues = [] } = useSWR(
    open ? `${dependencyDiscoveryUrl}/github/${dependency}` : null,
    async (u: string) => {
      setApiLimited(false);
      const issuesInfoReq = await fetch(u);
      if (issuesInfoReq.status === 403) {
        setApiLimited(true);
        return [];
      }
      const issuesInfoJson = await issuesInfoReq.json();
      return issuesInfoJson;
    }
  );

  // Handle collapse action
  const toggleCollapse = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow className={classes.root} onClick={() => toggleCollapse()}>
        <TableCell>
          <FiPackage className={classes.rowTitleIcon} />
          {dependency}
        </TableCell>

        <TableCell className={classes.iconRow}>
          <IconButton aria-label="expand row" size="large" onClick={() => toggleCollapse()}>
            {open ? (
              <KeyboardArrowUpIcon className={classes.icons} />
            ) : (
              <KeyboardArrowDownIcon className={classes.icons} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {projectInfo && issues ? (
              <Box className={classes.collapseBox}>
                {projectInfo?.gitRepository?.url ? (
                  <div className={classes.dependencyInfo}>
                    <GitHubIcon className={classes.dependencyInfoIcon} />
                    <div>
                      <strong>Github: </strong>
                      <a
                        className={classes.links}
                        href={projectInfo.gitRepository.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {projectInfo.gitRepository.url}
                      </a>
                    </div>
                  </div>
                ) : null}
                {projectInfo?.directory ? (
                  <div className={classes.dependencyInfo}>
                    <FolderIcon className={classes.dependencyInfoIcon} />
                    <div>
                      <strong>Directory: </strong>
                      <span>{projectInfo.directory}</span>
                    </div>
                  </div>
                ) : null}
                {projectInfo?.license ? (
                  <div className={classes.dependencyInfo}>
                    <CopyrightIcon className={classes.dependencyInfoIcon} />
                    <div>
                      <strong>License: </strong>
                      <span>{projectInfo.license}</span>
                    </div>
                  </div>
                ) : null}
                <div className={classes.dependencyInfoIssue}>
                  <VscIssues className={classes.dependencyInfoIcon} />
                  <div>
                    <strong>
                      Issues &#40;Labeled with hacktoberfest, good first issue, or help wanted&#41;
                      :{' '}
                    </strong>
                  </div>
                </div>
                {issues.length !== 0 ? (
                  issues.map((issue: issueInfo) => {
                    return (
                      <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={classes.issueCardLink}
                        key={issue.htmlUrl}
                      >
                        <div className={classes.issueCard}>
                          <VscIssues className={classes.dependencyInfoIcon} />
                          <div>
                            <div className={classes.issueCardTitle}>{issue.title}</div>
                            <div>
                              #{issue.htmlUrl.match(/([0-9]*)$/)?.at(0)} opened on{' '}
                              {new Date(issue.createdAt).toDateString()}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div>
                    {apiLimited ? (
                      <span>
                        Github API reached limit, please use the link directly{' '}
                        <a
                          href={projectInfo.gitRepository.issuesUrl}
                          className={classes.links}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {dependency}
                        </a>
                      </span>
                    ) : (
                      'No Issue found with label hacktoberfest, good first issue, or help wanted'
                    )}
                  </div>
                )}
              </Box>
            ) : (
              <Box className={classes.collapseBoxLoading}>
                <CircularProgress className={classes.colorPrimary} />
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
