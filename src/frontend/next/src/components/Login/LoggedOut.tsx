import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import config from '../../config';

const useStyles = makeStyles((theme) => ({
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    color: theme.palette.primary.contrastText,
    lineHeight: 1,
  },
}));

const LoggedOut = () => {
  const classes = useStyles();
  const { loginUrl } = config;

  return (
    <Button className={classes.button} href={loginUrl}>
      LOGIN
    </Button>
  );
};

export default LoggedOut;
