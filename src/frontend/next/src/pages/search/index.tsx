import { FC } from 'react';
import PageBase from './PageBase';
import SearchPage from '../components/SearchPage';

interface SearchProps {}

const Search: FC<SearchProps> = () => {
  return (
    <PageBase title="Search">
      <SearchPage />
    </PageBase>
  );
};

export default Search;
