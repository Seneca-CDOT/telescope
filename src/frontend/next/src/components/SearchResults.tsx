import { makeStyles } from '@material-ui/core/styles';
import { useSWRInfinite } from 'swr';
import { Container, Box } from '@material-ui/core';

import useSiteMetadata from '../hooks/use-site-metadata';
import Timeline from './Posts/Timeline';
import Spinner from './Spinner';

const useStyles = makeStyles(() => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
  searchResults: {
    padding: 0,
    width: '100%',
    justifyContent: 'center',
  },
  errorBackground: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    background: '#353F61',
    boxShadow: '0 15px 30px rgba(0,0,0,.5)',
    lineHeight: '1rem',
  },
  errorTitle: {
    textAlign: 'center',
    fontSize: '5rem',
    color: '#fff',
  },
  errorMessage: {
    lineHeight: '2rem',
    fontSize: '2rem',
    textAlign: 'center',
    margin: '2rem',
    color: '#96C1E7',
  },
}));

type SearchResultProps = {
  text: string;
  filter: 'post' | 'author';
};

const SearchResults = ({ text, filter }: SearchResultProps) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const prepareUrl = (index: number) =>
    `${telescopeUrl}/query?text=${encodeURIComponent(text)}&filter=${filter}&page=${index}`;

  // We only bother doing the request if we have something to search for.
  const shouldFetch = () => text.length > 0;
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => (shouldFetch() ? prepareUrl(index) : null),
    async (u) => {
      const res = await fetch(u);
      const results = await res.json();
      return results.values;
    }
  );
  const loading = !data && !error;

  if (error) {
    return (
      <Container className={classes.searchResults}>
        <Box boxShadow={2} marginTop={10}>
          <div className={classes.errorBackground}>
            <div>
              <p className={classes.errorTitle}>Search Error</p>
              <p className={classes.errorMessage}>
                There was a server error while processing your query
              </p>
            </div>
          </div>
        </Box>
      </Container>
    );
  }

  if (text.length && loading) {
    return (
      <Container className={classes.searchResults}>
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      </Container>
    );
  }

  return (
    <Container className={classes.searchResults}>
      {data && data.length ? (
        <Timeline pages={data} nextPage={() => setSize(size + 1)} />
      ) : (
        <h1>No search results</h1>
      )}
    </Container>
  );
};

export default SearchResults;
