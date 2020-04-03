import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, ButtonBase } from '@material-ui/core';
import { graphql } from 'gatsby';

import SEO from '../components/SEO';
import Header from '../components/Header';
import AboutFooter from '../components/AboutFooter';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.post,
  },
  markdownBody: {
    padding: '2rem',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SEO title={frontmatter.title} />
      <Header />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="photo" src="/src/frontend/src/images/photo1.jpg" />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.markdownBody}>
            <h1>{frontmatter.title}</h1>
            <h2>{frontmatter.date}</h2>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </Grid>
      </Grid>
      <AboutFooter />
    </div>
  );
}

Template.propTypes = {
  data: PropTypes.string,
  markdownRemark: PropTypes.string,
  frontmatter: PropTypes.string,
  html: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;
