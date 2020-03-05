import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

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
    color: '#002944',
    padding: '2em',
  },
  title: {
    fontSize: '2em',
  },
  author: {
    fontSize: '1.2em',
  },
  published: {
    textDecoration: 'none',
    color: '#A4D4FF',
  },
  content: {
    padding: '2em',
  },
});

function formatPublishedDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatted = new Intl.DateTimeFormat('en-CA', options).format(date);
  return `Last Updated ${formatted}`;
}

const Post = ({ id, html, author, url, title, date }) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <header className={classes.header}>
        <h2 id={id} className={classes.title}>
          {title}
        </h2>
        <h3 className={classes.author}>By {author}</h3>
        <a href={url} rel="bookmark" className={classes.published}>
          <time dateTime={date}>{formatPublishedDate(date)}</time>
        </a>
      </header>

      <Grid container>
        <Grid item xs={12} className={classes.content}>
          <section className="telescope-post-content" dangerouslySetInnerHTML={{ __html: html }} />
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
};

export default Post;
