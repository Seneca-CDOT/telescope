import { createStyles, makeStyles, Theme, ListSubheader } from '@material-ui/core';
import { AiOutlineYoutube } from 'react-icons/ai';
import { useYouTubeInfo } from '@hooks/use-genericInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('lg')]: {
        width: '21rem',
      },
      color: theme.palette.text.secondary,
      lineHeight: 'normal',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      '&:hover': {
        textDecorationLine: 'none',
      },
    },
    icon: {
      fontSize: '2rem',
      marginRight: '1rem',
      verticalAlign: 'text-bottom',
    },
    YouTubeInfoContainer: {
      margin: '0 0 0 1rem',
      fontSize: '1.2rem',
    },
    YouTubeTitleSection: {
      fontSize: '1.4rem',
      margin: 0,
      paddingTop: '1rem',
      lineHeight: 'normal',
    },
  })
);

const YouTubeInfoMobile = () => {
  const classes = useStyles();

  const { channelUrl, subscriberCount, viewCount } = useYouTubeInfo();

  return (
    <ListSubheader component="div" className={classes.root}>
      {!!channelUrl && (
        <div className={classes.YouTubeInfoContainer}>
          <h2 className={classes.YouTubeTitleSection}>
            <a href={channelUrl} className={classes.link}>
              <AiOutlineYoutube className={classes.icon} /> Channel
            </a>
          </h2>
          <p>{subscriberCount} subscribers</p>
          <p>{viewCount} views</p>
        </div>
      )}
    </ListSubheader>
  );
};

export default YouTubeInfoMobile;
