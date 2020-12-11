import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import useSiteMetadata from '../../hooks/use-site-metadata';

const useStyles = makeStyles(({ theme }: { theme: any }) => ({
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

// LoggedOut() params: { telescopeUrl }: { telescopeUrl: any }
function LoggedOut() {
  //const { telescopeUrl: any } = { telescopeUrl }; //useSiteMetadata() getStaticProps()
  const { telescopeUrl } = useSiteMetadata();
  const loginUrl = `${telescopeUrl}/auth/login`;
  const classes = useStyles();

  return (
    <Button className={classes.button}>
      <a href={loginUrl} className={classes.link}>
        LOGIN
      </a>
    </Button>
  );
}

export default LoggedOut;
