import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    color: theme.palette.text.secondary,
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    width: 500,
    backgroundColor: '#3670A5',
  },
  input: {
    flex: 1,
    padding: 7,
    backgroundColor: '#9E9E9E',
    fontSize: 14,
  },
  iconButton: {
    color: '#002944',
    backgroundColor: '#3670A5',
  },
  formControl: {
    minWidth: 80,
    padding: 7,
    backgroundColor: '#3670A5',
  },
  selectEmpty: {
    fontSize: 14,
  },
}));

function CustomizedInputBase(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    filter: '',
  });
  const { searchText, onChangeHandler } = props;

  const handleChange = (filter) => (event) => {
    setState({
      ...state,
      [filter]: event.target.value,
    });
  };

  const onTextChange = (event) => {
    onChangeHandler(event);
  };

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.paper}>
        <FormControl className={classes.formControl}>
          <NativeSelect
            disableUnderline
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
          value={searchText}
          onChange={(event) => onTextChange(event)}
        />
      </Paper>
    </div>
  );
}

export default CustomizedInputBase;
