import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageBase from './PageBase';
import SearchPage from '../components/SearchPage';

const Search = () => {
  return (
    <BrowserRouter>
      <PageBase title="Search">
        <SearchPage />
      </PageBase>
    </BrowserRouter>
  );
};

export default Search;
