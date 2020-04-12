import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import PropTypes from 'prop-types';

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
  const { searchText, onChangeHandler, onFilterChangeHandler, filter } = props;

  const onFilterChange = (event) => {
    onFilterChangeHandler(event.target.value);
  };

  const onTextChange = (event) => {
    onChangeHandler(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.paper}>
        <FormControl className={classes.formControl}>
          <NativeSelect
            disableUnderline
            value={filter}
            onChange={(event) => onFilterChange(event)}
            name="filter"
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'filter' }}
          >
            <option value="author">Author</option>
            <option selected value="post">
              Post
            </option>
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

CustomizedInputBase.propTypes = {
  searchText: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onFilterChangeHandler: PropTypes.func,
  filter: PropTypes.string,
};
export default CustomizedInputBase;
