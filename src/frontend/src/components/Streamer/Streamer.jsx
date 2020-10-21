import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function Streamer(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ListItem button>
        <ListItemIcon>
          <Avatar className={classes.orange}>DH</Avatar>
        </ListItemIcon>
        <ListItemText primary={props.name}></ListItemText>
      </ListItem>
    </div>
  );
}

Streamer.propTypes = {
  name: PropTypes.string,
};
