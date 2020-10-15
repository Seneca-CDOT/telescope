import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader } from '@material-ui/core';
import syntaxHighlight from './syntax-highlight';
import './telescope-post-content.css';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    fontSize: '1.5rem',
    marginBottom: '4em',
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    padding: '3em',
    lineHeight: '1.3',
    top: '62px',
    [theme.breakpoints.between('xs', 'sm')]: {
      paddingTop: '2em',
      paddingBottom: '2em',
    },
  },
  title: {
    fontSize: '3.5em',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
}));

function formatPublishedDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatted = new Intl.DateTimeFormat('en-CA', options).format(date);
  return `Last Updated ${formatted}`;
}

const Post = ({ id, html, author, url, title, date, link }) => {
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef(null);
  // When we initialize, find and highlight all <pre> elements contained within.
  useEffect(() => {
    syntaxHighlight(sectionEl.current);
  }, [sectionEl]);

  return (
    <Box className={classes.root} boxShadow={2}>
      <ListSubheader className={classes.header}>
        <Typography variant="h1" title={title} id={id} className={classes.title}>
          {title}
        </Typography>
        <Typography variant="h3" className={classes.author}>
          By{' '}
          <a className={classes.link} href={link}>
            {author}
          </a>
        </Typography>
        <a href={url} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={date}>
            {formatPublishedDate(date)}
          </time>
        </a>
      </ListSubheader>

      <Grid container>
        <Grid item xs={12} className={classes.content}>
          <section
            ref={sectionEl}
            className="telescope-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Post.propTypes = {
  id: PropTypes.string,
  url: PropTypes.string,
  author: PropTypes.string,
  html: PropTypes.any,
  title: PropTypes.string,
  date: PropTypes.string,
  link: PropTypes.string,
};

export default Post;
