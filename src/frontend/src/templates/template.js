import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { graphql } from 'gatsby';

import PageBase from '../pages/PageBase';
import AboutFooter from '../components/AboutFooter';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.post,
  },
  markdownBody: {
    padding: '2rem',
    fontSize: '16px',
    maxWidth: '785px',
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
    <PageBase title={frontmatter.title}>
      <Grid container className={classes.root}>
        <Grid container direction="column" item xs={12} justify="center" alignItems="center">
          <Grid item xs={12}>
            <div className={classes.markdownBody}>
              <h1>{frontmatter.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </Grid>
        </Grid>
        <AboutFooter />
      </Grid>
    </PageBase>
  );
}

Template.propTypes = {
  data: PropTypes.string,
  markdownRemark: PropTypes.string,
  frontmatter: PropTypes.string,
  html: PropTypes.string,
  title: PropTypes.string,
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;
