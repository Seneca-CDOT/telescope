import EventIcon from '@material-ui/icons/Event';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CardActionArea,
  CardContent,
  Typography,
  Card,
  CardMedia,
  Container,
  Avatar,
} from '@material-ui/core';
import DynamicBackgroundContainer from '../DynamicBackgroundContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'visible',
    maxWidth: '785px',
    padding: theme.spacing(2, 0, 2, 0),
  },

  avatar: {
    height: 100,
    width: 100,
    margin: 'auto',
    fontWeight: 500,
    backgroundColor: '#3670A5',
    fontSize: '2.5rem',
    color: theme.palette.grey[200],
    letterSpacing: -1,
    position: 'relative',
    top: theme.spacing(8),
    zIndex: 100,
  },

  infoBox: {
    backgroundColor: theme.palette.grey[300],
  },

  h2: {
    fontSize: '2.4rem',
    color: theme.palette.grey[200],
  },

  body: {
    fontSize: '1.8rem',
    color: theme.palette.grey[300],

    '& > *': {
      fontSize: '1.8rem',
      marginRight: theme.spacing(2),
      position: 'relative',
      top: theme.spacing(0.5),
    },
  },

  card: {
    backgroundColor: theme.palette.grey[400],
  },

  cardContent: {
    backgroundColor: theme.palette.primary.main,
  },

  backgroundImage: {
    height: 250,
    overflow: 'hidden',
  },
}));

export default function AuthorResult(props) {
  const classes = useStyles();
  const { author } = props;
  const { postDate, title, postLink } = props.post;

  const handleLatestPostClick = () => {
    window.open(postLink);
  };

  // Strip noncapital characters
  // Ex. RayGervais -> R G
  const authorInitials = author.replace(/[a-z]/g, '');

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardActionArea onClick={handleLatestPostClick}>
          <CardMedia className={classes.backgroundImage}>
            {/* TODO: Pull Cover_Image from post metadata if availble */}
            <DynamicBackgroundContainer />

            <Avatar className={classes.avatar}>{authorInitials}</Avatar>
          </CardMedia>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2" className={classes.h2}>
              {author}
            </Typography>
            <Typography variant="body1" color="textPrimary" component="p" className={classes.body}>
              <PermContactCalendarIcon className={classes.icons} />
              Latest Post: {title}
            </Typography>
            <Typography variant="body1" color="textPrimary" component="p" className={classes.body}>
              <EventIcon className={classes.icons} />
              Post Date: {postDate}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Container>
  );
}
