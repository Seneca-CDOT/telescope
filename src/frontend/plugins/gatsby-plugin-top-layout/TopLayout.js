import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

import CustomThemeProvider from '../../src/theme/CustomThemeProvider';

export default function TopLayout(props) {
  return (
    <>
      <CustomThemeProvider>
        <CssBaseline />
        {props.children}
      </CustomThemeProvider>
    </>
  );
}

TopLayout.propTypes = {
  children: PropTypes.node,
};
