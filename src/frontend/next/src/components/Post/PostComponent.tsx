import { useRef, useState } from 'react';

import useSWR from 'swr';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader, createStyles } from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import { Post } from '../../interfaces';
import { AdminButtons } from '../AdminButtons';
import Spinner from '../Spinner';

type Props = {
  postUrl: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      fontSize: '1.5rem',
      marginBottom: '4em',
    },
    header: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.secondary,
      padding: '2em 3em 2em 3em',
      lineHeight: '1.3',
      zIndex: 1100,
      top: '-1.1em',
      [theme.breakpoints.down(1440)]: {
        paddingTop: '1.6em',
        paddingBottom: '1.5em',
      },
      [theme.breakpoints.down(1065)]: {
        position: 'static',
      },
    },
    expandHeader: {
      whiteSpace: 'normal',
      cursor: 'pointer',
    },
    collapseHeader: {
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
    title: {
      fontSize: '3.5em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '2.5em',
      },
    },
    author: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '1.2em',
      },
    },
    published: {
      fontSize: '1.2em',
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '1em',
      },
    },
    content: {
      overflow: 'auto',
      padding: '2em',
      color: theme.palette.text.primary,
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    time: {
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    spinner: {
      padding: '20px',
    },
    error: {
      lineHeight: '1.00',
      fontSize: '1em',
    },
  })
);

const formatPublishedDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatted = new Intl.DateTimeFormat('en-CA', options).format(date);
  return `Last Updated ${formatted}`;
};

const PostComponent = ({ postUrl }: Props) => {
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef<HTMLElement>(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR<Post>(postUrl);
  const [expandHeader, setExpandHeader] = useState(false);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            <Grid container className={classes.error}>
              <Grid item>
                <ErrorRoundedIcon className={classes.error} />
              </Grid>{' '}
              - Post Failed to Load
            </Grid>
          </Typography>
        </ListSubheader>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            Loading Blog...
          </Typography>
        </ListSubheader>

        <Grid container justify="center">
          <Grid item className={classes.spinner}>
            <Spinner />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className={classes.root} boxShadow={2}>
      <ListSubheader className={classes.header}>
        <AdminButtons />
        <Typography variant="h1" title={post.title} id={post.id} className={classes.title}>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setExpandHeader(!expandHeader)}
            onKeyDown={() => setExpandHeader(!expandHeader)}
            className={expandHeader ? classes.expandHeader : classes.collapseHeader}
          >
            {post.title}
          </span>
        </Typography>
        <Typography className={classes.author}>
          &nbsp;By&nbsp;
          <a className={classes.link} href={post.feed.url}>
            {post.feed.author}
          </a>
        </Typography>
        <a href={post.url} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={post.updated}>
            {` ${formatPublishedDate(post.updated)}`}
          </time>
        </a>
      </ListSubheader>

      <Grid container>
        <Grid item xs={12} className={classes.content}>
          <section
            ref={sectionEl}
            className="telescope-post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostComponent;
