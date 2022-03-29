import { makeStyles, Theme } from '@material-ui/core/styles';
import SearchResults from './SearchResults';
import SearchBar from './SearchBar';

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

  return (
    <div className={classes.searchPage}>
      <SearchBar />
      <SearchResults />
    </div>
  );
};

export default SearchPage;
