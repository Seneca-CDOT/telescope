import React, { Component } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
    };
  }

  render() {
    return (
      <>
        <Header className="header" scrolled={this.state.scrolled} />
        <SearchBar />
      </>
    );
  }
}

export default Search;
