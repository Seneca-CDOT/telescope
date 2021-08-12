import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, createStyles, Divider, Grid, Typography, useMediaQuery } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import GitHubContributorCard from './GitHubContributorCard';
import Logo from './Logo';
import { FaSlack } from 'react-icons/fa';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.primary.main,
      padding: '2rem',
    },
    heading: {
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.down('md')]: {
        marginTop: '2rem',
      },
    },
    leftDivider: {
      backgroundColor: theme.palette.primary.contrastText,
      height: '2px',
      marginBottom: '8px',
      marginRight: '1rem',
      marginTop: '5px',
      width: '50%',
    },
    rightDivider: {
      backgroundColor: theme.palette.primary.contrastText,
      height: '2px',
      marginBottom: '10px',
      marginLight: '1rem',
      marginTop: '5px',
      width: '30%',
    },
    links: {
      color: theme.palette.primary.contrastText,
      textDecorationLine: 'none',
      '&:hover': {
        textDecorationLine: 'underline',
      },
      alignItems: 'flex-start',
    },
    footer: {
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.down('sm')]: {
        paddingBottom: '6.5rem',
      },
    },
    card: {
      marginTop: '2rem',
    },
  })
);

const AboutFooter = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid container className={classes.root}>
      <Box width={1} pb={5}>
        {matches ? (
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Grid container item xs={12} sm={3}>
              <Grid container direction="column" item xs={6}>
                <Typography variant="h5" className={classes.heading}>
                  DOCS
                </Typography>
                <Divider className={classes.leftDivider} />
                <Typography variant="h6">
                  <a
                    href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md"
                    className={classes.links}
                  >
                    Get Started
                  </a>
                </Typography>
                <Typography variant="h6">
                  <a
                    href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/CONTRIBUTING.md"
                    className={classes.links}
                  >
                    Contribute
                  </a>
                </Typography>
              </Grid>
              <Grid container direction="column" item xs={6}>
                <Typography variant="h5" className={classes.heading}>
                  MORE
                </Typography>
                <Divider className={classes.leftDivider} />
                <Typography variant="h6">
                  <a
                    href="https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List"
                    className={classes.links}
                  >
                    Planet CDOT Feed List
                  </a>
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} justify="center">
              <Logo height={60} width={60} />
            </Grid>
            <Grid container direction="column" item xs={12} sm={3} alignItems="flex-end">
              <Typography variant="h5" className={classes.heading}>
                COMMUNITY
              </Typography>
              <Divider className={classes.rightDivider} />
              <Grid container direction="row" justify="flex-end" spacing={1}>
                <Grid item>
                  <a href="https://github.com/Seneca-CDOT/telescope" className={classes.links}>
                    {' '}
                    <GitHubIcon fontSize="large" />
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href="https://seneca-open-source.slack.com/archives/CS5DGCAE5"
                    className={classes.links}
                  >
                    <FaSlack size="22" />
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Grid container item xs={12} justify="center">
              <Logo height={60} width={60} />
            </Grid>
            <Grid container item xs={12}>
              <Grid container direction="column" item xs={6}>
                <Typography variant="h5" className={classes.heading}>
                  DOCS
                </Typography>
                <Divider className={classes.leftDivider} />
                <Typography variant="h6">
                  <a
                    href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md"
                    className={classes.links}
                  >
                    Get Started
                  </a>
                </Typography>
                <Typography variant="h6">
                  <a
                    href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/CONTRIBUTING.md"
                    className={classes.links}
                  >
                    Contribute
                  </a>
                </Typography>
              </Grid>
              <Grid container direction="column" item xs={6} alignItems="flex-end">
                <Typography variant="h5" className={classes.heading}>
                  MORE
                </Typography>
                <Divider className={classes.rightDivider} />
                <Typography variant="h6">
                  <a
                    href="https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List"
                    className={classes.links}
                  >
                    Planet CDOT Feed List
                  </a>
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" item xs={6}>
              <Typography variant="h5" className={classes.heading}>
                COMMUNITY
              </Typography>
              <Divider className={classes.leftDivider} />
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <a href="https://github.com/Seneca-CDOT/telescope" className={classes.links}>
                    {' '}
                    <GitHubIcon fontSize="large" />
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href="https://seneca-open-source.slack.com/archives/CS5DGCAE5"
                    className={classes.links}
                  >
                    <FaSlack size="22" />
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={4} className={classes.card}>
          <GitHubContributorCard />
        </Grid>
      </Box>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.footer}>
          Copyright © {new Date().getFullYear()} Seneca’s Centre for Development of Open Technology
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AboutFooter;
