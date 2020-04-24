/* eslint-disable import/prefer-default-export, react/prop-types */
import React from 'react';
import 'typeface-roboto';
import TopLayout from './TopLayout';

export const wrapRootElement = ({ element }) => {
  return <TopLayout>{element}</TopLayout>;
};
