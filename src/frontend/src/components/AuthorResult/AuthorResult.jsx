import CreateIcon from '@material-ui/icons/Create';
import EventIcon from '@material-ui/icons/Event';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    color: theme.palette.text.secondary,
    maxWidth: 500,
    margin: `${theme.spacing(1)}px auto`,
  },
  imageBox: {
    height: 110,
    width: 128,
    backgroundColor: '#9E9E9E',
  },
  avatar: {
    height: 100,
    width: 100,
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  icons: {
    marginTop: '-2px',
    paddingLeft: '20px',
    paddingRight: '10px',
  },
  infoBox: {
    marginTop: '10px',
  },
  infoLine: {
    paddingBottom: '5px',
  },
  font: {
    color: '#002944',
    fontFamily: 'Roboto',
    fontSize: '14px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    marginTop: '-20px',
    marginBottom: '',
  },
  expand: {
    marginTop: '',
    marginBottom: '-20px',
  },
}));

const AuthorResult = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={3} className={classes.imageBox}>
            <Avatar className={classes.avatar}>CS</Avatar>
          </Grid>
          <Grid xs container direction="column" spacing={0} className={classes.infoBox}>
            <Grid container direction="row" className={classes.infoLine} spacing={0}>
              <Grid item>
                <PermContactCalendarIcon className={classes.icons} />
              </Grid>
              <Grid item className={classes.font}>
                {
                  // username
                }
              </Grid>
            </Grid>
            <Grid container direction="row" className={classes.infoLine} spacing={0}>
              <Grid item>
                <EventIcon className={classes.icons} />
              </Grid>
              <Grid item className={classes.font}>
                Date of Last Post:
                {
                  // last post date
                }
              </Grid>
            </Grid>
            <Grid container direction="row" className={classes.infoLine} spacing={0}>
              <Grid item>
                <CreateIcon className={classes.icons} />
              </Grid>
              <Grid item className={classes.font}>
                Latest Post:
                {
                  // latest post info
                }
              </Grid>
              <ExpansionPanel className={classes.expand}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header"
                >
                  <Typography className={classes.heading}>More</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
                    lacus ex, sit amet blandit leo lobortis eget.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AuthorResult;
