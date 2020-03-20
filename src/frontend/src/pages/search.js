import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import SearchPage from '../components/SearchPage';
import useSiteMetadata from '../hooks/use-site-metadata';

const Search = () => {
  const { telescopeUrl } = useSiteMetadata();

  const httpLink = createHttpLink({
    fetch,
    uri: `${telescopeUrl}/graphql`,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <SearchPage />
    </ApolloProvider>
  );
};

export default Search;
