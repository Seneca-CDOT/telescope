import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';

const Search = () => {
  const httpLink = createHttpLink({
    uri: `http://localhost:3000/graphql`,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
    <div>
      <SEO title="Search" />
      <Header />
      <div
        style={{
          height: '12vh',
        }}
      ></div>
      <ApolloProvider client={client}>
        <SearchBar />
      </ApolloProvider>
    </div>
  );
};

export default Search;
