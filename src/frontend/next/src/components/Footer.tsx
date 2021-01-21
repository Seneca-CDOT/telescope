import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    top: 'auto',
    bottom: 0,
  },
  footer: {
    textAlign: 'center',
    color: theme.palette.primary.contrastText,
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.footer}>
          Copyright © {new Date().getFullYear()}{' '}
          <Link
            variant="h6"
            className={classes.footer}
            href="https://cdot.senecacollege.ca/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Seneca’s Centre for Development of Open Technology
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
