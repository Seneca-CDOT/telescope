import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 60,
  },
}));

export default function CustomizedInputBase() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    filter: '',
  });

  const handleChange = filter => event => {
    setState({
      ...state,
      [filter]: event.target.value,
    });
  };

  return (
    <Paper component="form" className={classes.root}>
      <FormControl className={classes.formControl}>
        <NativeSelect
          value={state.filter}
          onChange={handleChange('filter')}
          name="filter"
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'filter' }}
        >
          <option value="">None</option>
          <option value="author">Author</option>
          <option value="filter2">Filter2</option>
          <option value="filter3">Filter3</option>
        </NativeSelect>
      </FormControl>
      <InputBase
        className={classes.input}
        placeholder="Search Telescope"
        inputProps={{ 'aria-label': 'search telescope' }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
