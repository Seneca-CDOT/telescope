import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader } from '@material-ui/core';
import Spinner from '../Spinner/Spinner.jsx';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import AdminButtons from '../AdminButtons';

import 'highlight.js/styles/github.css';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    fontSize: '1.5rem',
    marginBottom: '4em',
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    padding: '1.4em',
    lineHeight: '1.3',
    zIndex: 1500,
    [theme.breakpoints.down(1440)]: {
      padding: '.7em',
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
    color: theme.palette.text.primary,
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '1.2em',
    },
  },
  published: {
    fontSize: '1.2em',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '1em',
    },
  },
  content: {
    overflow: 'auto',
    padding: '2em',
    color: theme.palette.text.default,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
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
  telescopePostContent: {
    fontSize: '1.8rem',
    lineHeight: '1.6',
    textAlign: 'left',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    hyphens: 'auto',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, Ubuntu, Roboto, noto, segoe ui, arial, sans-serif',
    '& p': {
      margin: '1.2rem 0',
    },
    '& img': {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '100%',
      paddingTop: '1.5rem',
      paddingBottom: '1rem',
      width: '100%',
    },
    '& figure': {
      display: 'block',
      margin: '0',
      textAlign: 'center',
    },
    "& img[src*='emoji'], & img[src*='smileys']": {
      display: 'inline-block',
      width: '1.6rem',
      padding: '0',
      verticalAlign: 'text-top',
    },
    "& img[src*='svg']": {
      width: '2rem',
      padding: '0',
      verticalAlign: 'center',
    },
    "& img[src*='medium.com/_/stat']": {
      width: '1px',
      height: '1px',
    },
    '& h1': {
      fontSize: '2em',
      maxWidth: '670px',
      marginRight: 'auto',
      marginLeft: 'auto',
      lineHeight: '1.6',
    },
    '& ol, & ul': {
      padding: '0 1.5em',
      lineHeight: '25px',
      margin: '12px 0',
    },
    '& code, & pre': {
      overflowWrap: 'unset',
      wordWrap: 'none',
      fontFamily: "Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', monospace",
      background: '#eff0f1',
      color: '#242424',
    },
    '& pre': {
      border: '1px solid #242424',
      pageBreakInside: 'avoid',
      fontSize: '1.5rem',
      lineHeight: '1.5',
      maxWidth: '100%',
      overflow: 'auto',
      padding: '0.5em 1.5em',
      wordWrap: 'break-word',
    },
    '& a': {
      color: theme.palette.text.secondary,
    },
    '& a:active, & a:visited': {
      color: theme.palette.text.visited,
    },
    '& blockquote, & q': {
      lineHeight: '1.5',
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: '50px',
      paddingLeft: '15px',
      display: 'block',
      fontStyle: 'italic',
    },
    '& .iframe-video-wrapper': {
      position: 'relative',
      paddingBottom: '56.25%', // 16:9
      height: '0',
    },
    '& .iframe-video-wrapper iframe': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
  },
}));

const formatPublishedDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatted = new Intl.DateTimeFormat('en-CA', options).format(date);
  return `Last Updated ${formatted}`;
};

const Post = ({ postUrl }) => {
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR(postUrl, (url) => fetch(url).then((r) => r.json()));
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
            <Spinner animation="border" variant="light">
              <span className="sr-only" textAlign="center">
                Loading...
              </span>
            </Spinner>
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
            onClick={() => setExpandHeader(!expandHeader)}
            className={expandHeader ? classes.expandHeader : classes.collapseHeader}
          >
            {post.title}
          </span>
        </Typography>
        <Typography variant={'p'} className={classes.author}>
          &nbsp;By&nbsp;
          <a className={classes.link} href={post.feed.link}>
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
            className={classes.telescopePostContent}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Post.propTypes = {
  postUrl: PropTypes.string,
};

export default Post;
