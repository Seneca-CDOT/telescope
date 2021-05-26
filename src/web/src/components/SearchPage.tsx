import { makeStyles, Theme } from '@material-ui/core/styles';
import SearchResults from './SearchResults';
import SearchBar from './SearchBar';
import SearchHelp from './SearchHelp';
import useSearchValue from '../hooks/use-search-value';

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
  const { showHelp } = useSearchValue();

  return (
    <div className={classes.searchPage}>
      <SearchBar />
      {showHelp && <SearchHelp />}
      <SearchResults />
    </div>
  );
};

export default SearchPage;
