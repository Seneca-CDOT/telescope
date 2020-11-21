/**
 * A base for building all of our pages.  This resets the CSS
 * and makes our <html> font 10px.  Any other "global" things
 * that need to happen for a page should get added here, and
 * then they will trickle down to the other pages.
 *
 * Make sure any new pages use this to wrap all elements in
 * their render function.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SEO from '../components/SEO';
import Header from '../components/Header';
import BottomBar from '../components/BottomBar';

const styles = {
  '@global': {
    html: {
      // Use 10px vs. 16px for the default font size rem unit.
      fontSize: 10,
    },
  },
};

function PageBase({ children, title }) {
  return (
    <>
      <SEO title={title} />
      <Header />
      {children}
      <BottomBar />
    </>
  );
}

PageBase.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default withStyles(styles)(PageBase);
