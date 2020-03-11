import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
<<<<<<< HEAD
<<<<<<< HEAD
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';
=======
=======
import fetch from 'node-fetch';
>>>>>>> added fetch so npm build will not error
import SearchPage from '../components/SearchPage';
>>>>>>> changes based on humphd feedback

const Search = () => {
  const httpLink = createHttpLink({
    fetch,
    uri: 'https://localhost:3000/graphql',
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
<<<<<<< HEAD
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
=======
    <ApolloProvider client={client}>
      <SearchPage />
    </ApolloProvider>
>>>>>>> changes based on humphd feedback
  );
};

export default Search;
