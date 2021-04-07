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

type MDXPageBaseProps = {
  children: object;
  title: string;
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      fontFamily: 'Spartan',
      padding: '1em 0 2em 0',
      wordWrap: 'break-word',
      [theme.breakpoints.down(1024)]: {
        maxWidth: 'none',
      },
      '& h1': {
        color: theme.palette.text.secondary,
        fontSize: 24,
        transition: 'color 1s',
        padding: '2vh 22vw',
        [theme.breakpoints.down(1024)]: {
          padding: '1vh 8vw',
          wordWrap: 'break-word',
        },
      },
      '& h2': {
        color: theme.palette.text.secondary,
        fontSize: 20,
        transition: 'color 1s',
        padding: '2vh 22vw',
        [theme.breakpoints.down(1024)]: {
          padding: '1vh 8vw',
          wordWrap: 'break-word',
        },
      },
      '& p': {
        color: theme.palette.text.primary,
        fontSize: 16,
        padding: '1vh 20vw',
        marginBottom: '0',
        [theme.breakpoints.down(1024)]: {
          padding: '1vh 5vw',
          wordWrap: 'break-word',
        },
      },
      '& a': {
        color: theme.palette.action.active,
      },
      '& a:visited': {
        color: theme.palette.action.selected,
      },
      '& svg': {
        color: theme.palette.primary.main,
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
    </div>
  );
};

export default Pagebase;
