import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { graphql } from 'gatsby';

import SEO from '../components/SEO';
import Header from '../components/Header';
import AboutFooter from '../components/AboutFooter';
import Footer from '../components/Footer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.post,
    height: '100vh',
  },
  markdownBody: {
    padding: '2rem',
  },
  aboutFooter: {
    margin: '10rem',
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
      <div className={classes.markdownBody}>
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className={classes.aboutFooter}>
          <AboutFooter />
        </div>
      </div>
      <Footer />
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
