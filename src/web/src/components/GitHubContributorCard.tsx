import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Avatar, Grid } from '@material-ui/core';
import useTelescopeContributor from '../hooks/use-telescope-contributor';

const contributionsCount = (contributions: number) =>
  contributions < 2 ? '1 contribution.' : `${contributions} contributions.`;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  typography: {
    color: theme.palette.text.primary,
    fontSize: '13px',
  },
  link: {
    color: theme.palette.text.primary,
    textDecorationLine: 'underline',
    alignItems: 'flex-start',
  },
}));

const GitHubContributorCard = () => {
  const classes = useStyles();
  const { contributor, error } = useTelescopeContributor();

  if (error || !contributor) {
    return null;
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Avatar alt="Profile Picture" src={contributor.avatar_url} />
          </Grid>
          <Grid item xs={10} justify="flex-end">
            <Typography className={classes.typography}>
              Thank you&nbsp;
              <a href={contributor.html_url} className={classes.link}>
                {contributor.login}
              </a>
              , for being a&nbsp;
              <a
                href="https://github.com/Seneca-CDOT/telescope/graphs/contributors"
                className={classes.link}
              >
                Telescope project contributor
              </a>
              , with your
              <a
                href={`https://github.com/Seneca-CDOT/telescope/commits?author=${contributor.login}`}
                className={classes.link}
              >
                &nbsp;
                {contributionsCount(contributor.contributions)}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GitHubContributorCard;
