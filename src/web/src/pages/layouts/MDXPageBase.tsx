/*
 * A base for building all of our MDX pages.  Any other "global"
 * things that need to happen for a page should get added here,
 * and then they will trickle down to the other MDX pages.
 *
 * Make sure any new MDX style pages use this to wrap all
 * elements in their render function.
 */

import { makeStyles } from '@material-ui/core/styles';
import SEO from '../../components/SEO';
import AboutFooter from '../../components/AboutFooter';

type MDXPageBaseProps = {
  children: object;
  title: string;
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      fontFamily: 'Spartan',
      paddingTop: '0.67em',
      '& h1': {
        color: theme.palette.text.secondary,
        fontSize: 24,
        paddingLeft: '5px',
        transition: 'color 1s',
      },
      '& h2': {
        color: theme.palette.text.secondary,
        fontSize: 20,
        paddingLeft: '5px',
        transition: 'color 1s',
      },
      '& p': {
        color: theme.palette.text.primary,
        fontSize: 16,
        padding: '3px 5px',
      },
    },
  };
});

const Pagebase = ({ children, title }: MDXPageBaseProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <SEO pageTitle={title} />
      {children}
      <AboutFooter />
    </div>
  );
};

export default Pagebase;
