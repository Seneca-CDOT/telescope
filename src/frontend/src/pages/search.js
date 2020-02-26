import React, { Component } from 'react';
import Header from '../components/Header';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
    };
  }

  render() {
    return <Header className="header" scrolled={this.state.scrolled} />;
  }
}

export default Search;
