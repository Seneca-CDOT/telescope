import CreateIcon from '@material-ui/icons/Create';
import EventIcon from '@material-ui/icons/Event';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    color: theme.palette.text.secondary,
    margin: `${theme.spacing(1)}px auto`,
  },
  imageBox: {
    height: 110,
    width: 128,
    backgroundColor: '#444444',
  },
  avatar: {
    height: 100,
    width: 100,
    margin: 'auto',
    backgroundColor: '#3670A5',
  },
  icons: {
    color: '#3670A5',
  },
  infoBox: {
    backgroundColor: '#9E9E9E',
  },
  infoLine: {
    paddingBottom: '5px',
    marginTop: '-12px',
    marginBottom: '-10px',
  },
  font: {
    color: '#002944',
    fontFamily: 'Roboto',
    marginLeft: '-15px',
  },
  expand: {
    marginBottom: '-20px',
  },
}));

export default function AuthorResult(props) {
  const classes = useStyles();
  const { author } = props;
  const { postDate, title, postLink } = props.post;

  const handleLatestPostClick = () => {
    window.open(postLink);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={3} className={classes.imageBox}>
            <Avatar className={classes.avatar}>CS</Avatar>
          </Grid>
          <Grid item xs container direction="column" spacing={0} className={classes.infoBox}>
            <Grid container direction="row" spacing={0}>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
              >
                <ListItem button className={classes.infoLine}>
                  <ListItemIcon className={classes.icons}>
                    <PermContactCalendarIcon />
                  </ListItemIcon>
                  <ListItemText className={classes.font} primary={`Username: ${author}`} />
                </ListItem>
                <ListItem button className={classes.infoLine}>
                  <ListItemIcon className={classes.icons}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.font}
                    primary={`Date of Last Post: ${postDate}`}
                  />
                </ListItem>
                <ListItem button className={classes.infoLine} onClick={handleLatestPostClick}>
                  <ListItemIcon className={classes.icons}>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText className={classes.font} primary={`Latest Post: ${title}`} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
