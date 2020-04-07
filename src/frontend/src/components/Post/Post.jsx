import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

import syntaxHighlight from './syntax-highlight';
import './telescope-post-content.css';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 0,
    fontSize: '1.5rem',
    marginBottom: '8em',
  },
  header: {
    backgroundColor: '#335A7E',
    color: '#97d5ff',
    padding: '2em',
    lineHeight: '1.3',
  },
  title: {
    fontSize: '2.5em',
  },
  author: {
    fontSize: '1.2em',
  },
  published: {
    textDecoration: 'none',
    color: '#002944',
  },
  content: {
    padding: '2em',
  },
  link: {
    textDecoration: 'none',
    color: '#97d5ff',
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
  time: {
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
});

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
  useEffect(() => syntaxHighlight(sectionEl.current), [sectionEl]);

  return (
    <Container className={classes.root}>
      <header className={classes.header}>
        <h1 id={id} className={classes.title}>
          {title}
        </h1>
        <h3 className={classes.author}>
          By{' '}
          <a className={classes.link} href={link}>
            {author}
          </a>
        </h3>
        <a href={url} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={date}>
            {formatPublishedDate(date)}
          </time>
        </a>
      </header>

      <Grid container>
        <Grid item xs={12} className={classes.content}>
          <section
            ref={sectionEl}
            className="telescope-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Grid>
      </Grid>
    </Container>
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
