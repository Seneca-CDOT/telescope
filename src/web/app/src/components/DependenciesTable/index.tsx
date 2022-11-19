import { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { makeStyles } from '@material-ui/core/styles';

import Row from './Row';
import SearchInput from '@components/SearchInput/SearchInput';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px',
      color: theme.palette.text.primary,
    },
    '& .MuiTablePagination-actions': {
      color: theme.palette.text.primary,
    },
  },
}));

type DependenciesTableProps = {
  dependencies: string[];
};

const DependenciesTable = ({ dependencies }: DependenciesTableProps) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const rowsPerPage = 15; // Set 15 element per page
  const [searchField, setSearchField] = useState('');

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Compute dependencyList based on search query
  const dependencyList = useMemo(() => {
    setPage(0);
    if (!searchField) return dependencies;
    return dependencies.filter((dependency: string) => {
      return dependency.toLowerCase().includes(searchField.toLowerCase());
    });
  }, [dependencies, searchField]);

  return (
    <>
      <SearchInput text={searchField} setText={setSearchField} labelFor="Browse for a dependency" />

      <TableContainer>
        <Table sx={{ minWidth: 450 }} aria-label="custom pagination table">
          <TableBody>
            {dependencyList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((dependency) => {
                return <Row key={dependency} dependency={dependency} />;
              })}
          </TableBody>
        </Table>
        <TablePagination
          className={classes.root}
          rowsPerPageOptions={[]}
          component="div"
          count={dependencyList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </TableContainer>
    </>
  );
};

export default DependenciesTable;
