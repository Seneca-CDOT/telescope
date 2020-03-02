import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const Search = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          height: '12vh',
        }}
      ></div>
      <SearchBar />
    </div>
  );
};

export default Search;
