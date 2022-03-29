import { useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SearchResults from './SearchResults';
import SearchBar from './SearchBar';
import SearchHelp from './SearchHelp';

const useStyles = makeStyles((theme: Theme) => ({
  searchPage: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingTop: 'env(safe-area-inset-top)',
  },
  anchor: {
    position: 'absolute',
    top: 0,
  },
  anchorMobile: {
    position: 'relative',
    bottom: '71px',
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const [showHelp, toggleHelp] = useState(true);
  const router = useRouter();

  const textParam = Array.isArray(router.query.text)
    ? router.query.text[0]
    : router.query.text || '';
  const filterParam = router.query.filter === 'post' || !router.query.filter ? 'post' : 'author';

  return (
    <div className={classes.searchPage}>
      <SearchBar />
      {showHelp && <SearchHelp />}
      <SearchResults textParam={textParam} filter={filterParam} toggleHelp={toggleHelp} />
    </div>
  );
};

export default SearchPage;
