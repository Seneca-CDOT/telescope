import { useContext } from 'react';
import { SearchContext, SearchContextInterface } from '../components/SearchProvider';

const useSearchValue = (): SearchContextInterface => useContext(SearchContext);

export default useSearchValue;
