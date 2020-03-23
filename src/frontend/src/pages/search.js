import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';

const Search = () => {
  return (
    <div>
      <SEO title="Search" />
      <Header />
      <SearchBar />
    </div>
  );
};

export default Search;
